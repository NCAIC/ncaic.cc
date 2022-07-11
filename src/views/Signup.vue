<script setup lang="ts">
const brochure = [
    "一、競賽時間： 2022 年 X 月 Y 日",
    "二、競賽項目：五子棋",
    "三、參賽資格：",
    "\t(一) 只要你是人類，你就可以報名參賽！",
    "\t(二) 以隊為單位報名，每隊不限人數",
    "四、賽制：報名截止後依照隊伍數決定",
    "五、競賽獎勵：",
    "\t參賽隊伍獎勵：",
    "\t\t第一名：ABCD",
    "\t\t第三名：ABCD",
    "\t\t第二名：ABCD",
    "六、 賽事規章：",
    "\t競賽項目別：五子棋",
    "\t(一) 定義：",
    "\t\t局 set：一個盤面分出勝負或無法再下為一局",
    "\t\t場 match：和一個隊伍配對比賽為一場",
    "\t(二) 規則：",
    "\t\t棋盤大小：15 路棋盤。",
    "\t\t局平手：若某一局平手，則白棋獲勝。",
    "\t\t一場比賽共有四局，雙方將輪流持黑棋。四局若平手，再比兩局延長賽，延長賽平手則以<span class='text-rose-600'>總思考時間較少者</span>獲勝。",
    "\t\t初始盤面：前兩局初始盤面為空盤，第三、四局及第五、六局分別會產生兩組隨機的初始盤面。",
    "\t\t時間限制：每局每隊思考時間加總限制為<span class='text-rose-600'>三分鐘</span>。",
    "\t\t犯規：分為一般犯規與嚴重犯規，若一般犯規該局判輸，嚴重犯規則取消比賽資格。",
    "\t\t\t一般犯規：下棋超過棋盤邊界、下到已經有棋的位置、超出時間限制。",
    "\t\t\t嚴重犯規：以任何方式干擾比賽系統運作、以任何方式干擾對方程式運作、抄襲程式碼。",
    "\t\t主辦單位對規則有最終解釋權。",
    "\t(三) 輸入與輸出：",
    "\t\t採用標準輸入 (stdin) 與輸出 (stdout)，格式如下：",
    "<img src='/board.png' class='w-96' />",
    "<span class='text-indigo-600'>輸入：</span>",
    '輸入共有 3 個部分，分別為目前盤面 B、您的持子 S、您剩餘的時間 T。三個部分間會以 ", "（不含 " 號）隔開。',
    "目前盤面 B：",
    "[[B<sub>(0,0)</sub>, B<sub>(0,1)</sub>, B<sub>(0,2)</sub>, …, B<sub>(0,14)</sub>], [B<sub>(1,0)</sub>, B<sub>(1,1)</sub>, B<sub>(1,2)</sub>, …, B<sub>(1,14)</sub>], …, [B<sub>(14,0)</sub>, B<sub>(14,1)</sub>, B<sub>(14,2)</sub>, …, B<sub>(14,14)</sub>]]",
    "B<sub>(i, j)</sub> ∈ {0,1,2}，其中 0 代表空格、1 代表黑棋、2 代表白棋",
    "您的持子 S：S ∈ { 0,1,2 }，其中 0 代表空格、1 代表黑棋、2 代表白棋",
    "您剩餘的時間 T：一個浮點數",
    "<div class='p-2 border border-gray-400'>[[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]], 2, 80</div>",
    "<span class='text-indigo-600'>輸出：</span>",
    "兩個數字 m n，代表您下的棋位置為 (i,j) = (m,n)，兩個數字間以空格 (space) 隔開，其中，0 ≤ m, n ≤ 14",
    "(四) 系統環境：",
    "\tOS: Ubuntu 22.04 LTS aarch64",
    "\tKernel: 5.15.0-1011-oracle",
    "\tCPU / Memory: 2-core / 12G",
    "\tC：",
    "\t\t編譯指令：gcc -O2 -o agent agent.c",
    "\t\t執行指令：./agent",
    "\tC++：",
    "\t\t編譯指令：g++ -O2 -o agent agent.cpp",
    "\t\t執行指令：./agent",
    "\tGolang：",
    "\t\t編譯指令：go build -o agent agent.go",
    "\t\t執行指令：./agent",
    "\tJavaScript：",
    "\t\t執行指令：node ./agent.js",
    "\tPython：",
    "\t\t執行指令：python -B ./agent.py",
    "\tRust：",
    "\t\t編譯指令：rustc -o agent agent.rs",
    "\t\t執行指令： ./agent.py",
    "\t\t可用套件：",
    "\t\t\trand: <a href='https://crates.io/crates/rand' target='_blank' class='text-blue-600'>https://crates.io/crates/rand</a>",
    "\tTypeScript：",
    "\t\t轉譯指令：tsc -o agent.js agent.ts",
    "\t\t執行指令：node ./agent.js",
].join("\n");
</script>

<template>
    <div class="flex h-full w-full justify-center p-4">
        <div class="flex h-full w-4/5 max-w-3xl flex-col items-center">
            <h1 class="my-4 text-3xl">競賽報名 Signup</h1>
            <div
                class="h-4/5 w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap rounded-md border border-gray-800 bg-white/70 p-4"
                v-html="brochure"
            ></div>
        </div>
    </div>
</template>
