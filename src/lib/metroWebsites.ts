
import { MetroWebsite } from '@/types';

export const metroWebsites: MetroWebsite[] = [
  {
    cityId: 'delhi',
    name: 'Delhi Metro Rail Corporation',
    url: 'https://www.delhimetrorail.com/',
    logo: '/logos/dmrc.png'
  },
  {
    cityId: 'mumbai',
    name: 'Mumbai Metro',
    url: 'https://www.mumbai-metro.com/',
    logo: '/logos/mumbai-metro.png'
  },
  {
    cityId: 'chennai',
    name: 'Chennai Metro Rail Limited',
    url: 'https://chennaimetrorail.org/',
    logo: '/logos/cmrl.png'
  },
  {
    cityId: 'kolkata',
    name: 'Kolkata Metro',
    url: 'https://www.mtp.indianrailways.gov.in/',
    logo: '/logos/kolkata-metro.png'
  },
  {
    cityId: 'bangalore',
    name: 'Bangalore Metro Rail Corporation Limited',
    url: 'https://bmrcl.co.in/',
    logo: '/logos/bmrcl.png'
  },
  {
    cityId: 'hyderabad',
    name: 'Hyderabad Metro Rail',
    url: 'https://www.ltmetro.com/',
    logo: '/logos/hmrl.png'
  },
  {
    cityId: 'kochi',
    name: 'Kochi Metro Rail Limited',
    url: 'https://kochimetro.org/',
    logo: '/logos/kmrl.png'
  },
  {
    cityId: 'jaipur',
    name: 'Jaipur Metro Rail Corporation',
    url: 'https://jaipurmetrorail.in/',
    logo: '/logos/jmrc.png'
  },
  {
    cityId: 'lucknow',
    name: 'Lucknow Metro Rail Corporation',
    url: 'https://www.upmetrorail.com/',
    logo: '/logos/lmrc.png'
  },
  {
    cityId: 'ahmedabad',
    name: 'Gujarat Metro Rail Corporation Limited',
    url: 'https://www.gujaratmetrorail.com/',
    logo: '/logos/gmrc.png'
  },
  {
    cityId: 'nagpur',
    name: 'Maharashtra Metro Rail Corporation Limited',
    url: 'https://www.metrorailnagpur.com/',
    logo: '/logos/nagpur-metro.png'
  },
  {
    cityId: 'pune',
    name: 'Pune Metro Rail Corporation Limited',
    url: 'https://www.punemetrorail.org/',
    logo: '/logos/pmrda.png'
  }
];

export const getMetroWebsiteByCity = (cityId: string): MetroWebsite | undefined => {
  return metroWebsites.find(website => website.cityId === cityId);
};
