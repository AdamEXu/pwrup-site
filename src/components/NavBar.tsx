export default function NavBar() {
    return (
        <div
            id="navbar"
            className="bg-black/20 fixed top-0 w-screen z-10 p-4 backdrop-blur-lg"
        >
            <div id="navcontainer" className="flex justify-between">
                <div id="navleft">
                    <a href="/">
                        <img
                            src="/PWRUP_text.svg"
                            alt="PWRUP"
                            className="h-4"
                        />
                    </a>
                </div>
                <div id="navright" className="flex space-x-6">
                    <a href="/blog" className="text-white">
                        Blog
                    </a>
                    <a href="/blog" className="text-white">
                        Socials
                    </a>
                </div>
            </div>
        </div>
    );
}
