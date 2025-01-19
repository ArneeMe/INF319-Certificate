import {db} from '@/app/firebase/fb_config';
import {collection, getDocs} from 'firebase/firestore';
import {Volunteer} from "@/app/util/Volunteer";

export const fetchVolunteers = async () => {
    const querySnapshot = await getDocs(collection(db, 'volunteers'));
    const volunteersData: Volunteer[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Volunteer, 'id'>;
        volunteersData.push({
            id: doc.id,
            ...data,
        });
    });
    return volunteersData;
};