import { reactive, ref, watch } from "vue";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, getFirestore, getDoc } from "firebase/firestore";
import { Octokit } from "octokit";
import { Base64 } from "js-base64";

export const app = initializeApp({
    apiKey: "AIzaSyB40fadGTlzS4OSf0HD--gxtFWMgT9Q5Tg",
    authDomain: "ncaic-2022.firebaseapp.com",
    projectId: "ncaic-2022",
    storageBucket: "ncaic-2022.appspot.com",
    messagingSenderId: "214029057071",
    appId: "1:214029057071:web:0270bad1b71d63d2305ada",
    measurementId: "G-NKW34L606L",
});

getAnalytics(app);

export const auth = getAuth(app);
export const user = ref<User | null>(null);
export const github = ref<Octokit | null>(null);
export const repo = reactive({ owner: "", repo: "" });
export const github_me = ref<any>(null);

export const team = ref<{
    name: string;
    org: string;
    members: { name: string; email: string; github: string }[];
    program: string;
}>({ name: "", org: "", members: [], program: "" });
watch(repo, async () => {
    if (repo.owner && repo.repo) {
        if (github.value === null) {
            return;
        }

        const result = await github.value.rest.repos.getContent({ ...repo, path: "team.json" });

        // @ts-ignore
        team.value = JSON.parse(Base64.decode(result.data.content));
    } else {
        team.value = { name: "", org: "", members: [], program: "" };
    }
});

export const initialized = ref(false);

onAuthStateChanged(auth, async (usr) => {
    user.value = usr;

    if (usr === null) {
        github.value = null;
    } else if (localStorage.getItem("gho-token")) {
        github.value = new Octokit({ auth: localStorage.getItem("gho-token") });
    }

    if (user.value) {
        await getDoc(doc(collection(db, "repo"), user.value.uid)).then((doc) => {
            if (doc.exists()) {
                [repo.owner, repo.repo] = [doc.data().owner, doc.data().repo];
            } else {
                [repo.owner, repo.repo] = ["", ""];
            }
        });
    }

    if (github.value) {
        github_me.value = (await github.value.rest.users.getAuthenticated()).data;
    }

    initialized.value = true;
});

export const db = getFirestore(app);
