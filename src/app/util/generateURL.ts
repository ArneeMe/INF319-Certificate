import {Volunteer} from "@/app/util/Volunteer";
import {generateParams} from "@/app/util/generateParams";

export const generateURL = (formData: Volunteer): string => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const path = 'verify'
    return `${baseUrl}/${path}?${generateParams(formData)}`;
};