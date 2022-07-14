import { reactive, ref } from "vue";
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, Auth, User } from "firebase/auth";
import {
    getFirestore,
    collection,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
    where,
    Firestore,
    getDocs,
} from "firebase/firestore";
import { Octokit } from "octokit";
import { Functions, getFunctions } from "firebase/functions";

export const stage = ref(0);
export const app = ref<FirebaseApp | null>(null);
export const auth = ref<Auth | null>(null);
export const db = ref<Firestore | null>(null);
export const functions = ref<Functions | null>(null);
export const user = ref<User | null>(null);
export const github = ref<Octokit | null>(null);
export const gh_self = ref<any>(null);
export const team = ref<TeamJson | null>(null);
export const schedules = reactive<Schedule[]>([]);
export const teams = reactive<Team[]>([]);
export const announcements = reactive<Announcement[]>([]);

initialize();

function initialize() {
    if (!app.value) {
        app.value = initializeApp({
            apiKey: "AIzaSyB40fadGTlzS4OSf0HD--gxtFWMgT9Q5Tg",
            authDomain: "ncaic-2022.firebaseapp.com",
            projectId: "ncaic-2022",
            storageBucket: "ncaic-2022.appspot.com",
            messagingSenderId: "214029057071",
            appId: "1:214029057071:web:0270bad1b71d63d2305ada",
            measurementId: "G-NKW34L606L",
        });

        getAnalytics(app.value);
    }

    auth.value = getAuth(app.value);
    db.value = getFirestore(app.value);
    functions.value = getFunctions(app.value, "asia-northeast1");
    subscribe();

    onAuthStateChanged(auth.value, auth_listener);

    if (stage.value < 1) {
        stage.value = 1;
    }
}

async function auth_listener(usr: User | null) {
    user.value = usr;

    if (usr === null) {
        github.value = null;
    } else if (localStorage.getItem("gho-token")) {
        github.value = new Octokit({ auth: localStorage.getItem("gho-token") });
    }

    if (stage.value < 2) {
        stage.value = 2;
    }

    while (true) {
        try {
            await Promise.all([
                (async () => {
                    if (user.value && db.value) {
                        const docs = await getDocs(
                            query(
                                collection(db.value, "team"),
                                where("manager", "==", user.value.uid),
                            ),
                        );
                        if (docs.docs.length === 1) {
                            const [owner, repo] = docs.docs[0].id.split("#");
                            team.value = { ...docs.docs[0].data(), owner, repo } as TeamJson;
                        }
                    }
                })(),
                (async () => {
                    if (github.value) {
                        gh_self.value = (await github.value.rest.users.getAuthenticated()).data;
                    }
                })(),
            ]);

            if (stage.value < 3) {
                stage.value = 3;
            }
            break;
        } catch (err) {
            console.error(err);
        }
    }
}

function subscribe() {
    if (!db.value) {
        return;
    }

    const pairs = [
        [query(collection(db.value, "schedule"), orderBy("time", "asc")), schedules],
        [query(collection(db.value, "team")), teams],
        [
            query(
                collection(db.value, "news"),
                where("time", "<=", new Date()),
                orderBy("time", "desc"),
            ),
            announcements,
        ],
    ] as const;

    for (const [query, target] of pairs) {
        onSnapshot(query, (snapshot) => {
            target.splice(
                0,
                target.length,
                ...snapshot.docs.map((doc) => ({ ...(doc.data() as any), id: doc.id })),
            );
        });
    }
}

export interface Schedule {
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
}

export interface Team {
    id: string;
    name: string;
    org: string;
    members: {
        name: string;
        email?: string;
        github?: string;
    }[];
}

export interface Announcement {
    title: string;
    content: string;
    time: Timestamp;
    pinned?: boolean;
}

export interface TeamJson {
    register: boolean;
    name: string;
    org: string;
    members: { name: string; email: string; github: string }[];
    program: string;
    manager: string;
    owner: string;
    repo: string;
}
