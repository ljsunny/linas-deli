const About = () => {
    return (
        <section className="h-auto mx-auto lg:h-auto lg:px-20 lg:pt-16 lg:pb-40 lg:bg-[#FFFAEF]">
            {/* 제목 */}
            <h2 className="lg:text-4xl text-2xl font-semibold px-[1.5rem] my-[2.9rem] lg:text-center lg:mb-12">About</h2>

            {/* 메인 컨텐츠 */}
            <div className=" relative flex flex-col lg:flex-row items-center gap-12 gap-20">
                {/* 이미지 + 카드 */}
                <div className="relative  w-full h-[24rem] rounded-tr-lg rounded-br-lg lg:rounded-br-xl">
                    <img
                        src="/Banner/banner1.jpeg"
                        alt="Delicious food"
                        className="w-full h-full object-cover transform -translate-x-2/5 lg:translate-x-0 shadow-lg rounded-tr-lg rounded-br-lg lg:rounded-br-xl"
                    />
                    {/* 카드 UI */}
                    <div className="z-50 flex flex-col gap-3 lg:gap-5 absolute lg:-right-8 lg:-bottom-8 right-7 bottom-6 bg-white p-6 lg:p-8 rounded-lg shadow-lg w-[75%] lg:w-[80%]">
                        <h3 className="text-base lg:text-xl font-semibold mb-2 lg:mb-4">Come and visit us</h3>
                        <p className="flex text-xs lg:text-base items-center gap-2 text-gray-600">
                            <img src="/Icon/Outline/phone.svg" alt="Phone" className="w-5 h-5 lg:w-8 lg:h-8" />
                            (604)-688-8881
                        </p>
                        <p className="flex text-xs lg:text-base items-center gap-2 text-gray-600">
                            <img src="/Icon/Outline/mail.svg" alt="Email" className="w-5 h-5 lg:w-8 lg:h-8" />
                            linasdeli.info@gmail.com
                        </p>
                        <p className="flex text-xs lg:text-base items-start gap-2 text-gray-600">
                            <img src="/Icon/Outline/location-marker.svg" alt="Location" className="w-5 h-5 lg:w-8 lg:h-8 flex-shrink-0 mt-1" />
                            1689 Johnston St, <br />
                            Vancouver, BC V6H 3S2
                        </p>
                    </div>
                </div>

                {/* 텍스트 설명 */}
                <div className="flex w-full bg-[#FFFAEF] flex-col justify-center gap-4 px-[1.5rem] py-12 -mt-30 h-[20rem]">
                    <h3 className="text-black mt-16 font-pretendard text-[1.25rem] lg:text-2xl lg:mb-4 font-medium leading-[1.75rem]">
                        We provide healthy <br></br>food for your family.
                    </h3>
                    <p className="text-black font-pretendard text-[0.6875rem] lg:text-base font-light leading-[1.10081rem] lg:leading-loose">
                        At Lina’s, everyone is family, and you’ll find the friendliest
                        service in the city. Whether you are planning a gourmet wine tasting
                        or looking for simple snacks for the big game, Lina’s has a little
                        something for every palate and every budget.
                    </p>
                </div>
            </div>
        </section >
    );
};

export default About;