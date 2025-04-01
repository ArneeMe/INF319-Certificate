import {Volunteer} from "@/app/util/Volunteer";
import {generateParams} from "@/app/login/adminpage/generateParams";

export const baseURL = () : string => {
    return `${window.location.protocol}//${window.location.host}`;
}

export const generateURL = (formData: Volunteer): string => {
    const path = 'verify'
    return `${baseURL}/${path}?${generateParams(formData)}`;
};