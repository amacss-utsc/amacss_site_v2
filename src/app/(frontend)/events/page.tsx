import { getPayloadHMR } from "@payloadcms/next/utilities";
import configPromise from '@payload-config';
import React from "react";
import { Event } from "@/payload-types";
import { Media } from "@/components/Media";

const displayRichText = (richText) => {
    if (!richText || !richText.root || !richText.root.children) return [];
  
    return richText.root.children
      .filter(node => node.type === 'paragraph')
      .map(paragraph => 
        paragraph.children.map(child => child.text).join('')
      );
  };

export default async function Events() {
    const payload = await getPayloadHMR({ config: configPromise });

    const allEvents = await payload.find({
        collection: 'events',
        depth: 3,
        sort: '-date',
    });

    if (!allEvents.docs.length) {
        return <div>No events found</div>;
    }

    return (
        <div>
            <h1>Events</h1>
            {allEvents.docs.map((event: Event) => {
                const { 
                    id, 
                    title, 
                    date, 
                    endDate, 
                    startTime, 
                    endTime, 
                    description, 
                    registrationLink, 
                    image, 
                    eventTag,
                    ribbonTag 
                } = event;

                return (
                    <div key={event.id}>
                        <h2>{title}</h2>
                        <h3>(Start) Date: {new Date(date).toLocaleDateString()}</h3>
                        {endDate && <h4>End Date: {new Date(endDate).toLocaleDateString()}</h4>}
                        {startTime && <p>Start Time: {startTime}</p>}
                        {endTime && <p>End Time: {endTime}</p>}
                        <h3>Description:</h3>
                        <div>{displayRichText(event.description).join('\n')}</div>
                        {registrationLink && (
                            <a href={registrationLink} target="_blank" rel="noopener noreferrer">{registrationLink}</a>
                        )}
                        {image && <Media imgClassName="-z-10 object-cover" resource={image} />}
                        {eventTag && Array.isArray(eventTag) && (
                         <p> Event Tags: {eventTag.map((tag) => typeof tag === 'object' ? tag.eventTag : '').join(', ')}
                         </p>)}
                        {ribbonTag && typeof ribbonTag !== 'number' && (
                            <h6>Ribbon Tag: {ribbonTag.ribbonTag}</h6>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
