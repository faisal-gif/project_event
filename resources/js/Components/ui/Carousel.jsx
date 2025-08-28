import React, { useState, useEffect, useCallback,  forwardRef, useContext } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

const CarouselContext = React.createContext(null)

function useCarousel() {
    const context = useContext(CarouselContext)
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />")
    }
    return context
}

const Carousel = forwardRef(({
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className = "",
    children,
    ...props
}, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
        {
            ...opts,
            axis: orientation === "horizontal" ? "x" : "y"
        },
        plugins
    )
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    const onSelect = useCallback((api) => {
        if (!api) return
        setCanScrollPrev(api.canScrollPrev())
        setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
    const scrollNext = useCallback(() => api?.scrollNext(), [api])

    const handleKeyDown = useCallback((event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault()
            scrollPrev()
        } else if (event.key === "ArrowRight") {
            event.preventDefault()
            scrollNext()
        }
    }, [scrollPrev, scrollNext])

    useEffect(() => {
        if (api && setApi) setApi(api)
    }, [api, setApi])

    useEffect(() => {
        if (!api) return
        onSelect(api)
        api.on("reInit", onSelect)
        api.on("select", onSelect)
        return () => api?.off("select", onSelect)
    }, [api, onSelect])

    return (
        <CarouselContext.Provider value={{
            carouselRef,
            api,
            opts,
            orientation,
            scrollPrev,
            scrollNext,
            canScrollPrev,
            canScrollNext
        }}>
            <div
                ref={ref}
                onKeyDownCapture={handleKeyDown}
                className={`relative ${className}`}
                role="region"
                aria-roledescription="carousel"
                {...props}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    )
})
Carousel.displayName = "Carousel"

const CarouselContent = forwardRef(({ className = "", ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel()

    return (
        <div ref={carouselRef} className="overflow-hidden">
            <div
                ref={ref}
                className={`flex ${orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col"} ${className}`}
                {...props}
            />
        </div>
    )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = forwardRef(({ className = "", ...props }, ref) => {
    const { orientation } = useCarousel()
    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={`min-w-0 shrink-0 grow-0 ${orientation === "horizontal" ? "pl-4" : "pt-4"} ${className}`}
            {...props}
        />
    )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = forwardRef((props, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()

    return (
        <button
            ref={ref}
            className={`absolute z-10 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center
        ${orientation === "horizontal"
                    ? "hidden md:flex  sm:top-1/2 sm:-translate-y-1/2 sm:left-2"
                    : "-top-12 left-1/2 -translate-x-1/2 rotate-90"
                }
      `}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            {...props}
        >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
        </button>
    )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = forwardRef((props, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    return (
        <button
            ref={ref}
            className={`absolute z-10 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center
        ${orientation === "horizontal"
                    ? "hidden md:flex sm:top-1/2 sm:-translate-y-1/2 sm:right-2"
                    : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90"
                }
      `}
            onClick={scrollNext}
            disabled={!canScrollNext}
            {...props}
        >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
        </button>
    )
})
CarouselNext.displayName = "CarouselNext"

Carousel.Content = CarouselContent;
Carousel.Item = CarouselItem;
Carousel.Previous = CarouselPrevious;
Carousel.Next = CarouselNext;


export default Carousel;
