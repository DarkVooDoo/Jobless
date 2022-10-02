import Navbar from 'components/Navbar'

import { useAuthUser } from 'utils/hooks'

interface LayoutProps {
    children: JSX.Element
}
const Layout:React.FC<LayoutProps> = ({children })=>{

    useAuthUser()

    return (
        <div>
            <Navbar />
            <main>
                {children}
            </main>
            <footer style={{height: "4rem", backgroundColor: "var(--Primary-Color)"}}>
                Footer
            </footer>
        </div>

    )
}

export default Layout