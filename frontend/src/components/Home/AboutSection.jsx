import { IoCode } from "react-icons/io5";
import { HiUsers } from "react-icons/hi2";
import { FiZap } from "react-icons/fi";

const AboutSection = () => {
    return (
        <section className="py-10">
            <div className="container mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why DevTinder?</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Find your perfect match in the tech world. Whether you're looking for a coding partner, mentor, or just expanding your
                            network.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                    <div className="flex flex-col justify-center space-y-4 border border-primary/40 p-5 rounded-xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <IoCode className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Skill-Based Matching</h3>
                            <p className="text-muted-foreground sm:text-base text-sm">
                                Find developers with complementary skills to yours. Perfect for collaborative projects.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-4 border border-primary/40 p-5 rounded-xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <HiUsers className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Professional Networking</h3>
                            <p className="text-muted-foreground sm:text-base text-sm">
                                Expand your professional circle with like-minded developers in your field or area of interest.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-4 border border-primary/40 p-5 rounded-xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <FiZap className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Quick Connections</h3>
                            <p className="text-muted-foreground sm:text-base text-sm">
                                Our intuitive swiping interface makes finding the right connection fast and efficient.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
