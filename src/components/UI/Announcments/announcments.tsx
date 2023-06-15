import "./announcments.scss"
import { useEffect, useLayoutEffect, useState } from "react";
import { getAnnouncments } from "../../../lib/requestsApi";
import ContainerElementsWithShadow from "../ContainerElementsWithShadow/containerElementsWithShadow";
import Flickity from "flickity";
import { HubConnection } from "@microsoft/signalr";

export default function Announcments({connectionHub}: AnnouncmentsProps) {
    const [annoncmentsList, setAnnoncmentsList] = useState<Array<AnnouncmentItem>>([]);
    const getAnnouncmentsElems = (list: Array<AnnouncmentItem>) => {
        return list.map((item) => {
            return <Announcment key={item.name} item={item} />
        })
    };

    useEffect(() => {
        window.addEventListener('resize', (e) => {
            let flickityContainer : HTMLElement = document.querySelector('.announcmentContainer > div')!;
            let flkty1 : Flickity = Flickity.data(flickityContainer);
            flkty1.destroy();
            let carouselElems : NodeListOf<HTMLElement> = document.querySelectorAll('.outerDiv');
            carouselElems.forEach((item) => {
                item.style.height = 'auto';
            });
            new Flickity(flickityContainer, {
                autoPlay: 10000,
                pauseAutoPlayOnHover: false,
                prevNextButtons: false,
                pageDots: false,
                wrapAround: true
            });
            carouselElems.forEach((item) => {
                item.style.height = '100%';
            });
        })
    })

    useEffect(() => {
        let flickityContainer : HTMLElement = document.querySelector('.announcmentContainer > div')!;
        let flkty = new Flickity(flickityContainer, {
            autoPlay: 10000,
            pauseAutoPlayOnHover: false,
            prevNextButtons: false,
            pageDots: false,
            wrapAround: true
        });
        let carouselElems : NodeListOf<HTMLElement> = document.querySelectorAll('.outerDiv');
        carouselElems.forEach((item) => {
            item.style.height = '100%';
        });
        return () => {
            flkty.destroy();
            let carouselElems :NodeListOf<HTMLElement> = document.querySelectorAll('.outerDiv');
            carouselElems.forEach((item) => {
                item.style.height = 'auto';
            });
        };
    }, [annoncmentsList]);

    useLayoutEffect(() => {
        getAnnouncments(setAnnoncmentsList);
    }, []);

    useEffect(() => {
        if (connectionHub != null)
            connectionHub.on('SendAnn', (updateAnnouncments) => {
                let flkty = Flickity.data('.announcmentContainer > div');
                if (flkty !== undefined)
                    flkty.destroy();
                setAnnoncmentsList(updateAnnouncments);
            })
    }, [connectionHub]);

    return (
        <ContainerElementsWithShadow className="announcmentContainer" render={() => (
            <div>
                {getAnnouncmentsElems(annoncmentsList)}
            </div>
        )}>
        </ContainerElementsWithShadow>
    );
}

function Announcment({item}: AnnouncmentProps) {
    const date = new Date(item.dateAdded);

    return (
        <div className="outerDiv">
            <div className="time futuraDemiC">
                <h2>{date.getDate()}<br /><span>{date.toLocaleString('ru', {
                    month: 'long'
                })}</span></h2>
            </div>
            <div className="details futuraBookC">
                <h2>{item.header}</h2>
                <p>
                    {item.name}
                </p>
            </div>
        </div>
    );
}

type AnnouncmentsProps = {
    connectionHub: HubConnection | null
}

type AnnouncmentProps ={
    item: AnnouncmentItem
}

type AnnouncmentItem ={
    dateAdded: string,
    header: string,
    name: string
}