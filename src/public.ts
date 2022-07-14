import { reactive } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./user";

export const schedule = reactive<any[]>([]);

onSnapshot(collection(db, "schedule"), (snapshot) => {
    schedule.splice(
        0,
        schedule.length,
        ...snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
    );
});

export const teams = reactive<any[]>([]);

onSnapshot(collection(db, "team"), (snapshot) => {
    teams.splice(0, teams.length, ...snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
});
