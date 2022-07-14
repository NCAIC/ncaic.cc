import { reactive } from "vue";
import { collection, query, orderBy, onSnapshot, Timestamp, where } from "firebase/firestore";
import { db } from "./user";

export const schedule = reactive<
    {
        id: string;
        rule: {
            matches: {
                type: string;
                count?: number;
            }[];
            rule: string;
            timeout: {
                step: number;
                set: number;
            };
        };
        teams: string[];
        time: Timestamp;
    }[]
>([]);

onSnapshot(query(collection(db, "schedule"), orderBy("time", "asc")), (snapshot) => {
    schedule.splice(
        0,
        schedule.length,
        ...snapshot.docs.map((doc) => ({ ...(doc.data() as any), id: doc.id })),
    );
});

export const teams = reactive<
    {
        id: string;
        name: string;
        org: string;
        members: {
            name: string;
            email?: string;
            github?: string;
        }[];
    }[]
>([]);

onSnapshot(collection(db, "team"), (snapshot) => {
    teams.splice(
        0,
        teams.length,
        ...snapshot.docs.map((doc) => ({ ...(doc.data() as any), id: doc.id })),
    );
});

export const news = reactive<
    {
        title: string;
        content: string;
        time: Timestamp;
        pinned?: boolean;
    }[]
>([]);

onSnapshot(
    query(collection(db, "news"), where("time", "<=", new Date()), orderBy("time", "desc")),
    (snapshot) => {
        news.splice(
            0,
            news.length,
            ...snapshot.docs.map((doc) => ({ ...(doc.data() as any), id: doc.id })),
        );
    },
);

// @ts-ignore
window.news = news;
