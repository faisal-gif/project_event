import React from 'react'
import Carousel from './ui/Carousel'
import Autoplay from 'embla-carousel-autoplay'
import FeaturedNewsCard from './FeaturedNewsCard'

function HeadlineEvents({ listHeadline }) {
    if (listHeadline.length === 0) {
        return (
            <div className="container max-w-4xl mx-auto px-4 py-4">
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl font-bold text-center">
                        Headline Event
                    </h1>
                    <p className="text-lg text-center text-gray-500">
                        Tidak ada Headline Event yang tersedia.
                    </p>
                </div>
            </div>
        )
    }
    return (
        <div className='container max-w-4xl px-4 md:px-0 mx-auto'>
            <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay()]}>
                <Carousel.Content>
                    {listHeadline.map((article) => (
                        <Carousel.Item key={article.id} className="basis-full">
                            <FeaturedNewsCard event={article} />
                        </Carousel.Item>
                    ))}
                </Carousel.Content>
                <Carousel.Previous />
                <Carousel.Next />
            </Carousel>
        </div>

    )
}

export default HeadlineEvents