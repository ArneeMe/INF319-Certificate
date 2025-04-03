export interface Certificate {
    signature_date: string;
    student_name_date: string;
    student_role: string;
    group_info: string;
    echo_info: string;

    verv_1?: string;
    verv_2?: string;
    verv_3?: string;

    signature_photo_1: string;
    signature_name_1: string;
    signature_role_1: string;
    signature_phone_1: string;

    signature_photo_2?: string;
    signature_name_2?: string;
    signature_role_2?: string;
    signature_phone_2?: string;

    qr_code: string;
    qr_info: string;
    qr_page: string;
}