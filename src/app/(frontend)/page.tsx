import { getPayloadHMR } from "@payloadcms/next/utilities";
import configPromise from '@payload-config';
import React from "react";
import { Dashboard, DashboardItem, Media } from "@/payload-types"; 

export default async function DashboardPage() {
  const payload = await getPayloadHMR({ config: configPromise });

  const dashboardData = await payload.findGlobal({ slug: 'dashboard', depth: 3 });

  console.log("dashboardData", dashboardData);
  if (!dashboardData) return <div>No dashboard found</div>;

  const { logo, items } = dashboardData as Dashboard;

  const getUrl = (media: Media | null | undefined): string | undefined => {
    if (media == null) {  
      return undefined;  
    }
    return media.url !== null ? media.url : undefined; 
  };

  const logoUrl = getUrl(logo);
  console.log("Logo URL:", logoUrl);

  return (
    <div>
      <h1>Dashboard</h1>
      {logoUrl ? (
        <img src={logoUrl} alt="Logo" />
      ) : (
        <div>No logo available</div>
      )}
      <div>
        {items?.length > 0 ? (
          items.map(({ id, text, backgroundImage }: DashboardItem) => (
            <div key={id}>
              <h2>{text}</h2>
              <img 
                src={getUrl(backgroundImage)} 
                alt={text} 
              />
            </div>
          ))
        ) : (
          <div>No dashboard items available</div>
        )}
      </div>
    </div>
  );
}
