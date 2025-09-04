// ------------------------------------------------------------------------
// 共通の実験パーツ
// ------------------------------------------------------------------------
// 実験固有で設定するのはこの2個所
const expname = "characteristic";
const datapipe_experiment_id = "nX0ylBPTMR8A"; // こっちは予備実験用
// const datapipe_experiment_id = "nAh0fw7bKkDO"; // こっちは本実験用

var filename; // OSFのファイル名
var inputVal; // 入力ボックスの要素を取得
var participant_ID = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;;

var jsPsych = initJsPsych({});

// クラウド(DataPipe)保存用のファイル名を生成
function createfilename(argseed) {
    // 日付時間秒を文字列で返す
    const dt = new Date();
    var yyyy = dt.getFullYear();
    var mm = ('00' + (dt.getMonth()+1)).slice(-2);
    var dd = ('00' + dt.getDate()).slice(-2);
    var hh = ('00' + dt.getHours()).slice(-2);
    var mi = ('00' + dt.getMinutes()).slice(-2);
    var se = ('00' + dt.getSeconds()).slice(-2);
    var answer = yyyy + mm + dd + "-" + hh + mi + se ;
    const subject_id = jsPsych.randomization.randomID(10);
    answer = argseed + answer + "-" + subject_id + ".csv" ;
    return(answer);
};
filename = createfilename(expname);

// イントロから問題までのインターバル
const gap = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '',
    trial_duration: 300 // ← 500ミリ秒
};

// 実験の同意書部分
const consent_form = {
  type: jsPsychSurveyMultiSelect,
  questions: [
    {
      prompt: "実験のご協力に同意いただける方は下記のチェックボックスにチェックを入れ、「次に進む」ボタンをクリックしてください。<br>同意いただけない方はそのままタブを閉じてください。",
      options: ['<b>本実験に参加することに同意する</b>'],
      required: true
    }
  ],
  preamble: '<header class="header">実験内容の説明と研究へのご協力のお願い</header>' +
      '<div class="consent">' +
      '<p class="title">1. 実験の目的および内容</p>' +
      '<p class="contents">本実験は、一人称および二人称の単語に対して、実験参加者がどんな印象を持っているのかについて調べることを目的としています。また、その単語から実験参加者がどんな人物像を想起するのかを調べることも目的としています。</p>' +
      '<p class="title">2. 実験の方法</p>' +
      '<p class="contents">本実験はwebブラウザ上で行います。画面上に提示される単語に対して質問に回答してもらいます。前半セクションと後半セクションに別れており、実験の所要時間は20分ほどです。質問には、あまり深く考えず感じたままに回答してください。</p>' + 
      '<p class="title">3. 実験結果データの扱いについて</p>' +
      '<p class="contents">本実験で得られたデータは統計的に処理され、研究の目的に限って使用されます。データを個人が特定可能な形で外部に公開することは一切ありません。</p>' +
      '<p class="title">4. 実験協力の自由および同意の撤回について</p>' +
      '<p class="contents">本実験への参加は、参加者ご自身の意思に基づくものであり、強制ではありません。実験前や実験中を問わず、ブラウザのタブを閉じることでいつでも参加を取りやめることができます。本実験に参加しないことによる不利益や同意の撤回に伴う不利益はありません。</p>' +
      '<p class="title">5. 実験に関する注意事項</p>' +
      '<p class="contents">実験中は、なるべく静かな環境でのご参加をお願いいたします。また、ブラウザの「戻る」ボタンはクリックしないようお願いいたします。そして、本実験の内容について、第三者への情報漏洩をしないようお願いいたします。</p>' +
      '<table class="affiliation"><tr><th>実験担当者 </th><th>明治大学大学院先端数理学研究科先端メディアサイエンス専攻 劉承旻</th></tr>' +
      '<tr><th>実験責任者 </th><th>明治大学総合数理学部先端メディアサイエンス学科 森勢将雅</th></tr>' +
      '<tr><th>住所 </th><th>〒164-8525 東京都中野区中野４丁目２１-１（森勢研究室）</th></tr>' +
      '</div>',
  button_label: ['次に進む']
};

/*
// 五桁のランダムな数字列を表示する
const random_number = {
  type: jsPsychSurveyMultiSelect,
  questions: [
    {
      prompt: "<p style='font-size: 20px font-weight: bold;'>メモができましたら、チェックして「次に進む」ボタンを押してください</p>",
      options: ["<b>メモしました</b>"],
      required: true
    }
  ],
  preamble: '<h1>実験に進む前に以下の番号をメモしてください</h1>' +
            '<p style="font-size: 20px">（実験終了後に使用しますので、忘れないようにメモして保管してください）</p><br>' +
            `<p style="font-size: 26px">${participant_ID}</p><br>`,
  button_label: ['次に進む']
}
  */

// 実験前置きのイントロ
const intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <h1>前半セクション</h1><br>
      <p style="font-size: 20px">ここでは、一人称および二人称の単語について各項目に回答してもらいます</p>
      <p style="font-size: 20px">各項目の形容語に対して自分が感じる「印象の度合い」を評価してください</p>
      <p style="font-size: 20px">単語はページの先頭に表示されます</p>
    `,
    choices: ['開始する']
};

// const stimuli = ["おれ", "ぼく", "おいら", "わし", "あんた", "きさま", "あたい", "あたし", "わらわ", "おぬし", "なんじ", "わがはい", "しょくん", "わたくし"];
const stimuli = ["おれ", "わたし"]
// 刺激をランダムに並べ替える
const shuffled_stimuli = jsPsych.randomization.shuffle(stimuli);

const adjectives = [
    { left: "男性的", right: "女性的" },
    { left: "幼い感じ", right: "老けた感じ" },
   // { left: "活発な", right: "弱々しい" },
    { left: "親切な", right: "意地悪な" },
    { left: "暖かい", right: "冷たい" },
    { left: "強そう", right: "弱そう" },
    { left: "偉そうな", right: "控えめな" },
];

const likert_scale = [
  "<p>とても<br>当てはまる</br></p>", 
  "<span style='font-size: 17px;'><p>当てはまる</p></span>",
  "<span style='font-size: 17px;'><p>少し<br>当てはまる</br></p></span>", 
  "<p>どちらともいえない</p>", 
  "<span style='font-size: 17px;'><p>少し<br>当てはまる</br></p></span>",
  "<span style='font-size: 17px;'><p>当てはまる</p></span>",
  "<p>とても<br>当てはまる</br></p>"
];
const likert_bio = ["成人男性", "少年", "おじいさん", "上司", "成人女性", "少女", "おばあさん", "お嬢様", "奥様", "幼児"]

// SD法での調査
const trials_7 = shuffled_stimuli.map(stim => {
    const questions = adjectives.map((pair) => ({
        prompt: `<div class="MakeTable">
                   <div class="LeftShift"><b style="font-size: 26px">${pair.left}</b></div>
                   <div class="RightShift"><b style="font-size: 26px">${pair.right}</b></div>
                 </div>
                 `,
        labels: likert_scale,
        required: true
    }));

    return {
        type: jsPsychSurveyLikert,
        scale_width: 800,
        randomize_question_order: true,
        preamble: `<div class="stimulus-box1">
                   <p style="font-size: 50px;">${stim}</p>
                 </div>
                 <br>
                 <b style="font-size: 19px">表示された単語の印象について、下記の項目に最もよく当てはまるものを答えてください</b>`,
        questions: questions,
        data: { stim: stim, block: 'SD7' },  // ← ここで安全に刺激情報を保存
    };
});

// キャラクタの人物像想起
const trials_bio = shuffled_stimuli.map(stim => ({
    type: jsPsychSurveyMultiSelect,
    preamble: `<div class="stimulus-box2">
                 <p style="font-size: 50px;">${stim}</p>
               </div>`,
    questions: [
      {
        prompt: `<b style="font-size: 19px">Q1. 表示された単語から<U>最も</U>当てはまる「人物像」を<U>1つ選んでください</U></b>`,
        name: 'Characteristics1', 
        options: likert_bio,
        required: true,
        horizontal: true
      },
      {
        prompt: `<b style="font-size: 19px">Q2. 表示された単語から当てはまる「人物像」を<U>全て選んでください</U><br>(
        1問目で選んだものも含めて）</b>`,
        name: 'Characteristics2', 
        options: likert_bio,
        required: true,
        horizontal: true
      }
    ],
    data: { stim: stim, block: 'BIO' },
    on_load: () => {
      // 少し待ってからイベント登録
      setTimeout(() => {
        const q1_boxes = document.querySelectorAll('input[name="jspsych-survey-multi-select-response-0"]');
        const q2_boxes = document.querySelectorAll('input[name="jspsych-survey-multi-select-response-1"]');

        // 最初はQ2を全部無効化
        q2_boxes.forEach(b => b.disabled = true);

        // Q1は「必ず1つだけ」選べるようにする
        q1_boxes.forEach(box => {
          box.addEventListener('change', e => {
            if (e.target.checked) {
              // 他の選択肢を外す
              q1_boxes.forEach(b => {
                if(b !== e.target) b.checked = false;
              });

              // Q2を有効化
              q2_boxes.forEach(b => b.disabled = false);
              } else{
                const anyChecked = Array.from(q1_boxes).some(b => b.checked);
                if(!anyChecked){
                  q2_boxes.forEach(b => b.disabled = true);
                }
              }
          });
        });
      }, 0);
    }
}));

// 後半セクションへの休憩所
const intermission = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <h1>つづいて、後半のセクションです</h1><br>
      <p style="font-size: 20px">後半セクションでは、単語から連想する「人物像」を回答してください</p>
      <p style="font-size: 20px">単語はページの先頭に表示されます</p>`,
    choices: ["進む"]
};

// 性別と年齢入力欄
const demographics = {
    type: jsPsychSurveyHtmlForm,
    preamble: "<h1>お疲れ様でした</h1><p style='font-size: 20px'>最後にご自身の以下項目にご回答をお願いします</p>",
    html: `
      <p>
        性別:
        <label><input name="gender" type="radio" value="male" required> 男性</label>
        <label><input name="gender" type="radio" value="female"> 女性</label>
        <label><input name="gender" type="radio" value="other"> その他</label>
        <label><input name="gender" type="radio" value="noans"> 答えたくない</label>
      </p>
      <p>
        本日時点の年齢（例：23）: 
        <input name="age" id="age-input" type="number" min="0" max="120" required>
      </p></br>
    `,
    button_label: "終了",
    on_load: () => {
      setTimeout(() => {
        const form = document.querySelector('#jspsych-survey-html-form'); // #jspsych-suevey-html-formのidを持つHTML要素を取得
        const button = document.querySelector('#jspsych-survey-html-form-next'); // #~のidを持つボタンを取得
        const genderInputs = form.querySelectorAll('input[name="gender"]'); //form内のname属性がgenderのinput要素を全て取得している
        const ageInput = form.querySelector("#age-input"); // form内のidがage-inputのinput要素を取得

        if (!button || !ageInput || genderInputs.length === 0) return;

        // 最初は押せない
        button.disabled = true;

        // 入力チェック関数
        const update = () => {
          const genderChecked = Array.from(genderInputs).some(r => r.checked); // 性別ボタンにチェックが入ってるかのブール
          const ageValue = ageInput.value.trim(); // 入力値の取り出し
          const ageValid = ageValue !== "" && !isNaN(ageValue) && ageValue >= 0 && ageValue <= 120; // 空値と0-120歳以外の範囲は無効
          button.disabled = !(genderChecked && ageValid);
        };

        // 変更時に監視
        genderInputs.forEach(r => r.addEventListener('change', update)); // 選択入力変更時にアップデートを実施
        ageInput.addEventListener('input', update); // 年齢入力変更時にアップデート関数実施

        // 初期チェック（復帰時やオートフィル対策）
        update();
      }, 0);
    }
};

// ID確認用の画面
const check_id = {
  type: jsPsychSurveyHtmlForm,
  preamble: "<h1>最後に</h1><br>" + 
            "<p style='font-size: 20px'>表示された以下の5桁の番号を<B><U>メモして</U></B>、入力欄に同じように記入してください</p>" +
            "<p style='font-size: 20px'>（番号は謝礼取引に必要なので、<B><U>必ずメモして紛失しないように</B></U>注意してください）</p><br>" + 
            `<p style='font-size: 26px'>${participant_ID}</p><br>`,
  html: 
    `<p>
      番号： <input name="entered_id" id="entered-id" type="number" required>
    </p> 
    <p style="color:red; display:none;" id="id-error">
      番号が一致しません、もう一度お確かめください
    </p>
    `,
  button_label: "確認",
  on_load: () => {
    setTimeout(() => {
      const form = document.querySelector('#jspsych-survey-html-form');
      const button = document.querySelector('#jspsych-survey-html-form-next');
      const input = document.querySelector('#entered-id');
      const errorMsg = document.querySelector('#id-error');

      if (!form || !button || !input) return;

      // 最初は押せないボタン
      button.disabled = true;

      // 入力値が数字かどうかのチェック
      input.addEventListener('input', () => {
        button.disabled = input.value.trim() === "";
      });

      // ボタンを押したときに確認
      button.addEventListener('click', (e) => {
        const entered = input.value.trim();
        if(entered !== String(participant_ID)) {
          e.preventDefault(); // data_saveに進むのを止める
          errorMsg.style.display = "block";
        } else {
          errorMsg.style.display = "none";
        }
      });
    }, 0);
  }
}

// DataPipe保存設定
const save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: datapipe_experiment_id, 
  filename: filename,
  data_string: ()=>jsPsych.data.get().csv()
};

// 実験終了の画面
const thanks = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: 
      '<h1>ご協力ありがとうございました</h1><br>' +
      '<p style="font-size: 20px">タブを閉じて終了し、Google Formへの回答をお願いします</p>'
};

jsPsych.run([consent_form, gap, intro, gap, ...trials_7, gap, intermission, gap, ...trials_bio, gap, demographics, check_id, save_data, thanks]);