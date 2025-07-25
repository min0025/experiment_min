// ------------------------------------------------------------------------
// 共通の実験パーツ
// ------------------------------------------------------------------------
// 実験固有で設定するのはこの2個所
const expname = "characteristic";
const datapipe_experiment_id = "nX0ylBPTMR8A";

var filename; // OSFのファイル名
var inputVal; // 入力ボックスの要素を取得
var csv_file; // 保存するcsvファイルの格納

var jsPsych = initJsPsych({
    on_finish: function () {
        // SD法 7段階の回答
        const sd7_trials = jsPsych.data.get().filter({ trial_type: 'survey-likert', block: 'SD7' }); // リッカート尺度で評価したデータにフィルタリング
        // 質問 人物像のやつ
        const bio_trials = jsPsych.data.get().filter({ trial_type: 'survey-likert', block: 'BIO' });
        // 刺激ごとの行
        const rows = []; // 数値の格納のための配列

        sd7_trials.values().forEach(trial => {
            const stim = trial.stim || '';  // data から安全に刺激を取る
            const res = trial.response; // データとしてリッカート尺度で入力した数値
            const row = [stim]; // 刺激の配列
            adjectives.forEach((pair, idx) => {
                const index = res[`Q${idx}`]; // リッカート尺度の入力場所indexをとる
                const val = likert_scale[index]; // 評価項目の値を得る
                row.push(val); // 評価値を刺激ごとに格納
            });

            // 追加: 同じ刺激に対応する9段階の結果を取得
            const bio_trial = bio_trials.values().find(t => t.stim === stim);
            if (bio_trial) {
                const bio_index = bio_trial.response['Q0']; // 9段階は1問だからQ0
                const bio_val = likert_bio[bio_index];
                row.push(bio_val);
            } else {
                row.push('');
            }

            rows.push(row);
        });

        const demo = jsPsych.data.get().filter({ trial_type: 'survey-html-form' }).values()[0];
        const gender = demo?.response?.gender || '';
        const age = demo?.response?.age || '';

        let csv = ['刺激,' + adjectives.map(pair => `${pair.left}-${pair.right}`).join(',') + ',人物像,性別,年齢'].join('\n');
        rows.forEach((r, idx) => {
            if (idx === 0) {
                csv += '\n' + r.join(',') + `,${gender},${age}`;
            } else {
                csv += '\n' + r.join(',') + ',,';
            }
        });

        csv_file = csv;
        
        // 作り終わった後にすぐ fetch する
    fetch("https://pipe.jspsych.org/api/data/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        experimentID: datapipe_experiment_id,
        filename: filename,
        data: csv_file,
      }),
    })
    .then(res => res.json())
    .then(res => console.log("Uploaded:", res))
    .catch(err => console.error("Error:", err));
  },
});

// クラウド(DataPipe)保存用のファイル名を生成
function createfilename(argseed) {
    // 日付時間秒を文字列で返す
    const dt = new Date();
    var yyyy = dt.getFullYear();
    var mm = ('00' + (dt.getMonth() + 1)).slice(-2);
    var dd = ('00' + dt.getDate()).slice(-2);
    var hh = ('00' + dt.getHours()).slice(-2);
    var mi = ('00' + dt.getMinutes()).slice(-2);
    var se = ('00' + dt.getSeconds()).slice(-2);
    var answer = yyyy + mm + dd + "-" + hh + mi + se;
    const subject_id = jsPsych.randomization.randomID(10);
    answer = argseed + answer + "-" + subject_id + ".csv";
    return (answer);
};
filename = createfilename(expname);

// 実験前置きのイントロ
const intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <h1>主観評価実験</h1>
      <p>この調査では、アニメの様々な1人称のテキストを見て各設問に評価してもらいます</p>
      <p>前半と後半の2段階のセクションに分かれています</p>
      <p>前半セクションでは、各質問に1から7の7段階評価をしてください</p>
    `,
    choices: ['開始する']
};

const stimuli = ["ぼく"];

const adjectives = [
    { left: "男性的", right: "女性的" },
    { left: "幼い感じ", right: "老けた感じ" },
    { left: "活発な", right: "弱々しい" },
    { left: "親切な", right: "意地悪な" },
    { left: "暖かい", right: "冷たい" },
    { left: "強そう", right: "弱そう" },
    { left: "偉そうな", right: "控えめな" },
];

const likert_scale = ["3", "2", "1", "0", "-1", "-2", "-3"];
const likert_bio = ["成人男性", "少年", "老人", "上司", "成人女性", "少女", "おばあさん", "お嬢様", "奥様", "幼児"]

// SD法での調査
const trials_7 = stimuli.map(stim => {
    const questions = adjectives.map((pair) => ({
        prompt: `<b style="font-size: 24px">${pair.left} - ${pair.right}</b><br>`,
        labels: likert_scale,
        required: true
    }));

    return {
        type: jsPsychSurveyLikert,
        scale_width: 800,
        randomize_question_order: true,
        preamble: `<div class="stimulus-box">
                   <p style="font-size: 50px;">${stim}</p>
                 </div>`,
        questions: questions,
        data: { stim: stim, block: 'SD7' }  // ← ここで安全に刺激情報を保存
    };
});

// キャラクタの人物像想起
const trials_bio = stimuli.map(stim => ({
    type: jsPsychSurveyLikert,
    scale_width: 1400,
    preamble: `<div class="stimulus-box">
                 <p style="font-size: 50px;">${stim}</p>
               </div>`,
    questions: [{
        prompt: `<b style="font-size: 24px">表示された単語から連想する人物像を選んでください</b><br>`,
        labels: likert_bio,
        required: true
    }],
    data: { stim: stim, block: 'BIO' },
    block: 'BIO'
}));

// 後半セクションへの休憩所
const intermission = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <h2>つづいて、後半のセクションです</h2>
      <p>後半セクションでは、各質問から連想する人物像を1つ選んで回答してください</p>
      <p>準備ができ次第、下のボタンから先に進んでください</p>`,
    choices: ["進む"]
};

// 性別と年齢入力欄
const demographics = {
    type: jsPsychSurveyHtmlForm,
    preamble: "<h2>アンケート</h2><p>最後にご自身の以下項目にご回答をお願いします。</p>",
    html: `
      <p>
        性別:
        <label><input name="gender" type="radio" value="male" required> 男性</label>
        <label><input name="gender" type="radio" value="female"> 女性</label>
        <label><input name="gender" type="radio" value="Other"> その他</label>
      </p>
      <p>
        年齢:
        <input name="age" type="number" min="0" max="120" required>
      </p>
    `,
    button_label: "終了"
};



// DataPipe保存設定
const save_data = {
    type: jsPsychPipe,
    action: "save",
    experiment_id: datapipe_experiment_id,
    filename: filename,
    data_string: () => csv_file
};

// 実験終了の画面
const thanks = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <h2>ご協力ありがとうございました。</h2>
      <p>下のボタンを押して。</p>`,
    choices: ["終了する"]
};

jsPsych.run([intro, ...trials_7, intermission, ...trials_bio, demographics, thanks]);
