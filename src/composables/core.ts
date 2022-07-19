import { reactive, ref } from "vue";
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, Auth, User, signOut } from "firebase/auth";
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
export let auto_logout_timer = 0;

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

    if (
        localStorage.getItem("gho-expires") &&
        parseInt(localStorage.getItem("gho-expires") || "0") <= Date.now()
    ) {
        sign_out();
    }

    if (usr && localStorage.getItem("gho-token")) {
        github.value = new Octokit({ auth: localStorage.getItem("gho-token") });
        set_auto_logout();
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

export function sign_out() {
    try {
        localStorage.removeItem("gho-token");
        localStorage.removeItem("gho-expires");
        if (auth.value) {
            signOut(auth.value);
        }
        if (user.value) {
            user.value = null;
        }
        if (github.value) {
            github.value = null;
        }
        if (gh_self.value) {
            gh_self.value = null;
        }
        if (team.value) {
            team.value = null;
        }
        import("sweetalert2").then(({ default: Swal }) =>
            Swal.fire({ title: "已登出", text: "成功登出囉！", icon: "success" }),
        );
    } catch (err) {
        console.error("Sign Out Error", err);
    }
}

export function set_auto_logout() {
    window.clearTimeout(auto_logout_timer);
    auto_logout_timer = window.setTimeout(() => {
        if (parseInt(localStorage.getItem("gho-expires") || "0") < Date.now() + 1000) {
            sign_out();
        }
    }, parseInt(localStorage.getItem("gho-expires") || "0") - Date.now());
    console.log(
        "logout in",
        (parseInt(localStorage.getItem("gho-expires") || "0") - Date.now()) / 1000,
        "seconds",
    );
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
    id: string;
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
