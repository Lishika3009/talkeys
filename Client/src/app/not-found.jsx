import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import image from "../public/images/Finding.png";
import Image from "next/image";
// import maryKate from "./fonts/MaryKate.woff"

export default function Component() {
	// const mar = maryKate();
	return (
		<div className={`flex h-[88.2vh] max-md:p-4 max-sm:p-1 bg-transparent text-white p-8`}>
			<div className="flex-1 flex flex-col justify-center items-center text-center">
				<h1 className="text-6xl max-sm:text-5xl font-bold mb-4">
					This page is still under construction
				</h1>
				<Link
					href="/"
					className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 w-48"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Homepage
				</Link>
			</div>
			<div className="flex-1 flex items-center justify-center max-md:absolute max-md:z-[-1] max-md:left-1/2 max-md:top-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:opacity-50">
				<div className="relative">
					<Image
						src={image}
						alt="404"
						width={400}
						height={400}
					/>
				</div>
			</div>
		</div>
	);
}
