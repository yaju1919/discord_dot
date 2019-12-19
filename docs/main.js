(function() {
    'use strict';
    const yaju1919 = yaju1919_library;
    const h = $("<div>").appendTo($("body")).css({
        "text-align": "center",
    });
    $("<h1>",{text:"ドット絵AAを作成します。"}).appendTo(h);
    const appendBtn = (title, func, holder=null) => $("<button>",{text: title}).appendTo(holder||h).click(func);
    //---------------------------------------------------------------------------------
    yaju1919.appendCheckButton(h,{
        title: "読み込む",
        change: v => v ? h_load.show() : h_load.hide()
    });
    const h_load = $("<div>").appendTo(h).hide();
    const input_list = yaju1919.appendInputText(h_load,{
        title: "中身の文字リスト",
        placeholder: "中身の文字を全部記入",
        hankaku: false,
    });
    const input_data = yaju1919.appendInputText(h_load,{
        placeholder: "ここにデータを入力",
        width: "10em",
        textarea: true,
        hankaku: false,
    });
    appendBtn("読み込む", () => {
        const list = input_list();
        let w_max = 0, h_max = 0;
        const mass_load = [];
        for(const line of input_data().split('\n')){
            h_max++;
            const line_array = [];
            mass_load.push(line_array);
            let count_w = 0;
            for(const c of line.split('')){
                if(list.indexOf(c)!==-1){
                    line_array.push(true);
                    count_w++;
                }
                else if(c === '　'){
                    line_array.push(false);
                    count_w++;
                }
            }
            if(w_max < count_w) w_max = count_w;
        }
        const inputs = h_input.find("input");
        inputs.eq(0).val(w_max);
        inputs.eq(1).val(h_max);
        make_canvas();
        for(let y = 0; y < h_max; y++){
            for(let x = 0; x < w_max; x++){
                if(mass_load[y][x]) {
                    tbody.find("tr").eq(y).find("td").eq(x).css({backgroundColor: color});
                    mass[y][x] = true;
                }
            }
        }
    }, h_load);
    h.append("<br>");
    //---------------------------------------------------------------------------------
    const h_input = $("<span>").appendTo(h);
    const input_w = yaju1919.appendInputNumber(h_input,{
        title: "行",
        value: 16,
        max: 50,
        min: 1,
        width: "3em",
    });
    h.append("　");
    const input_h = yaju1919.appendInputNumber(h_input,{
        title: "列",
        value: 16,
        max: 50,
        min: 1,
        width: "3em",
    });
    h.append("　");
    appendBtn("キャンバスをリセット").click(()=>{if(confirm("リセットしますか？")) make_canvas();});
    //---------------------------------------------------------------------------------
    const MASS_SIZE = "16px";
    const tbody = $("<tbody>").appendTo($("<table>").appendTo(h).css({
        "text-align": "center",
        "border-collapse": "collapse",
        "margin-bottom": MASS_SIZE,
        "user-select": "none" // ドラッグ禁止
    })).bind('contextmenu', () => false); // 右クリックのメニュー禁止
    let w_log, h_log, mass;
    const color = "blue";
    const default_color = "white";
    function make_canvas(){
        mass = [];
        tbody.empty();
        w_log = input_w();
        h_log = input_h();
        function mouse_event(elm, evt, x, y){
            switch(evt.which){
                case 0: // 無し
                    break;
                case 1: // 左クリック
                    elm.css({backgroundColor: color});
                    mass[y][x] = true;
                    break;
                case 3: // 右クリック
                    elm.css({backgroundColor: default_color});
                    mass[y][x] = false;
                    break;
            }
        }
        for(let y = 0; y < h_log; y++){
            mass.push(new Array(w_log));
            const tr = $("<tr>").appendTo(tbody);
            for(let x = 0; x < w_log; x++){
                $("<td>",{text:"　"}).appendTo(tr).css({
                    border: "1px solid gray",
                    width: MASS_SIZE,
                    "line-height": MASS_SIZE,
                    cursor: "pointer",
                    backgroundColor: default_color
                }).hover(function(e){ // マウスでホバーしたとき
                    $(this).css({
                        filter: `invert(${e.type === "mouseenter" ? "25%": "0%"})`
                    });
                }).mousedown(function(e){ // マウスを押したとき
                    mouse_event($(this), e, x ,y);
                }).mousemove(function(e){ // マウスを動かしたとき
                    mouse_event($(this), e, x ,y);
                }).contextmenu(function(e){ // 右クリックしたとき
                    mouse_event($(this), e, x ,y);
                });
            }
        }
    }
    make_canvas();
    const input_s = yaju1919.appendInputText(h,{
        title: "中身の文字",
        value: "あ",
        width: "2em",
        max: 1,
        hankaku: false,
    });
    const flag_discord = yaju1919.appendCheckButton(h,{
        title: "Discord用",
        value: true
    });
    appendBtn("この内容で作成する").click(()=>main());
    appendBtn("コピー", ()=>yaju1919.copy(result_log));
    //---------------------------------------------------------------------------------
    let result_log = "";
    const result = s => {
        if(!s.length) return;
        result_elm.text(s);
        result_log = s;
    };
    const result_elm = $("<pre>").appendTo($("body"));
    //---------------------------------------------------------------------------------
    function main(){
        const flag = flag_discord();
        const s = input_s();
        let str = '';
        if(flag) str += '.\n';
        for(const line of mass){
            let str2 = '';
            for(const m of line){
                if(m) {
                    if(flag) str2 += '||';
                    str2 += s;
                    if(flag) str2 += '||';
                }
                else {
                    str2 += "　";
                }
            }
            str += str2.replace(/　+$/,'') + "\n";
        }
        result(str);
    }
})();
