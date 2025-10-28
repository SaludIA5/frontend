import axios from "axios";
import type { Episode } from "../types/episode";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
}); 

interface Props {
    episode: Episode
}


export default function ValidateButtonTest({ episode }: Props){

    const validate = async () => {
        const userData = await api.get("users/");
        console.log(userData)
        const doctorId = userData.data.items[1].id;
        const newEpisode = {...episode, id: 102};

        const res = await api.post(`episodes/${newEpisode.id}/validate`,{
            "user_id": doctorId,
            "decision": "NO PERTINENTE",
        });
        console.log(res);
    }

    return(
        <button onClick={validate}>

        </button>
    )
}