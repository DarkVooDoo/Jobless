import { CallUserValuesTypes, UserTypes } from "pages/api/appointement/[id]"

class WebRTC{
    private user: string | undefined
    private peerConnection: RTCPeerConnection
    remoteCamera: HTMLVideoElement | undefined
    myCamera: HTMLVideoElement | undefined
    private session: RTCSessionDescriptionInit | undefined
    private allIceCandidates: string[]
    allSessions: CallUserValuesTypes[]
    private roomId: string | undefined

    constructor(userId?: string, roomId?: string, remoteCameraRef?:HTMLVideoElement, myCamera?:HTMLVideoElement){
        this.user = userId ?? undefined
        this.roomId = roomId ?? undefined
        this.peerConnection = new RTCPeerConnection()
        this.remoteCamera = remoteCameraRef ?? undefined
        this.myCamera = myCamera ?? undefined
        this.allIceCandidates = []
        this.allSessions = []
        this.session = undefined
        this.peerConnection.ontrack = (ev)=>{
            this.remoteCamera ? this.remoteCamera.srcObject = ev.streams[0] : null
        }

        this.peerConnection.onicecandidate = (ev)=>{
            this.allIceCandidates.push(JSON.stringify(ev.candidate))
        }

        this.peerConnection.onicegatheringstatechange = async ()=>{
            console.log(this.peerConnection.iceGatheringState)
            if(this.peerConnection.iceGatheringState === "complete"){
                //add ice candidate to the db with the offer
                // this.joinAppointement()
                const insertCandidate = await fetch(`/api/appointement/${this.roomId}`,{
                    method: "POST",
                    headers: [["Content-Type", "application/json"]],
                    body: JSON.stringify({session: this.session, candidate: this.allIceCandidates[0], user_id: this.user, appointement_id: this.roomId})
                })
            }
        }

    }

    addRemoteDescription = async(remoteDescription: string)=>{
        await this.peerConnection.setRemoteDescription(JSON.parse(remoteDescription))
    }

    getConnectionState = async ()=>{
        return this.peerConnection.iceGatheringState
    }
    
    createAppointement = async()=>{
        const insertSession = await fetch(`/api/appointement`,{
            method: "POST",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify({session: JSON.stringify(this.session), candidate: this.allIceCandidates[0], user_id: this.user})
        })
    }

    async starCall(){
        const gotOffer = this.allSessions.find(item=>{
            if(!item.candidate_session) return undefined
            return JSON.parse(item.candidate_session).type === "offer"
        })
        if(!gotOffer){
            console.log("Creating Offer")
            await this.addTracksToConnection()
            this.session = await this.peerConnection.createOffer({offerToReceiveVideo: true, offerToReceiveAudio: true})
            await this.peerConnection.setLocalDescription(this.session)   
            return 
        }
        console.log("Creating Answer")
        //TODO: Answer the call
        const allRemoteUsers = this.allSessions.filter(item=>item.user_id !== this.user)
        console.log(allRemoteUsers[0])
        const remoteSession = JSON.parse(allRemoteUsers[0].candidate_session)
        await this.peerConnection.setRemoteDescription(remoteSession)
        await this.addTracksToConnection()
        this.session = await this.peerConnection.createAnswer()
        await this.peerConnection.setLocalDescription(this.session)
        this.addIceCandidate(allRemoteUsers[0].candidate_candidate)
    }

    addIceCandidate = async (candidate: string)=>{
        await this.peerConnection.addIceCandidate(JSON.parse(candidate))
    }

    async addTracksToConnection(){
        const tracks = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
        tracks.getTracks().forEach(item=>{
            this.peerConnection.addTrack(item, tracks)
        })
        this.myCamera ? this.myCamera.srcObject = tracks : null
    }
}

export default WebRTC