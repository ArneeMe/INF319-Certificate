import {Volunteer} from "@/app/util/Volunteer";
import {generateParams} from "@/app/login/adminpage/generateParams";

export const generateURL = (formData: Volunteer): string => {
    const prefix = "attester.no/verify"
    return `${prefix}?${generateParams(formData)}`;
};