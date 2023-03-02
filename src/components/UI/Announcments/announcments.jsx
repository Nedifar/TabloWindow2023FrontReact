import "./announcments.css"
import { useEffect, useLayoutEffect, useState } from "react";
import { getAnnouncments } from "../../../lib/requestsApi";
import ContainerElementsWithShadow from "../ContainerElementsWithShadow/containerElementsWithShadow";
import Flickity from "flickity";

export default function Announcments(props) {
    const [annoncmentsList, setAnnoncmentsList] = useState([]);
    const getAnnouncmentsElems = (list) => {
        return list.map((item) => {
            return <Announcment key={item.name} item={item} />
        })
    };

    useEffect(() => {
        window.addEventListener('resize', (e) => {
            let flickityContainer = document.querySelector('.announcmentContainer > div');
            let flkty1 = Flickity.data(flickityContainer);
            flkty1.destroy();
            let carouselElems = document.querySelectorAll('.outerDiv');
            carouselElems.forEach((item) => {
                item.style.height = 'auto';
            });
            let flkty = new Flickity(flickityContainer, {
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
        let flickityContainer = document.querySelector('.announcmentContainer > div');
        let flkty = new Flickity(flickityContainer, {
            autoPlay: 10000,
            pauseAutoPlayOnHover: false,
            prevNextButtons: false,
            pageDots: false,
            wrapAround: true
        });
        let carouselElems = document.querySelectorAll('.outerDiv');
        carouselElems.forEach((item) => {
            item.style.height = '100%';
        });
        return () => {
            flkty.destroy();
            let carouselElems = document.querySelectorAll('.outerDiv');
            carouselElems.forEach((item) => {
                item.style.height = 'auto';
            });
        };
    }, [annoncmentsList]);

    useLayoutEffect(() => {
        getAnnouncments(setAnnoncmentsList);
    }, []);

    useEffect(() => {
        if (props.connectionHub != null)
            props.connectionHub.on('SendAnn', (updateAnnouncments) => {
                let flkty = Flickity.data('.announcmentContainer > div');
                if (flkty != undefined)
                    flkty.destroy();
                setAnnoncmentsList(updateAnnouncments);
            })
    }, [props.connectionHub]);

    return (
        <ContainerElementsWithShadow className="announcmentContainer" render={() => (
            <div>
                {getAnnouncmentsElems(annoncmentsList)}
            </div>
        )}>
        </ContainerElementsWithShadow>
    );
}

function Announcment(props) {
    const date = new Date(props.item.dateAdded);

    return (
        <div className="outerDiv">
            <div className="time futuraDemiC">
                <h2>{date.getDate()}<br /><span>{date.toLocaleString('ru', {
                    month: 'long'
                })}</span></h2>
            </div>
            <div className="details futuraBookC">
                <h2>{props.item.header}</h2>
                <p>
                    {props.item.name}
                </p>
            </div>
        </div>
    );
}