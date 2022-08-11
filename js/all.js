// 抓取dom節點
const inputText = document.querySelector(".inputText"); //文字輸入欄位
const addClick = document.querySelector(".addClick"); //新增點擊按鈕

let todoData = []; // 存放物件待辦的陣列

// --------------------------------------------------------------
// 渲染
const todoList = document.querySelector(".list");

function render(array) {
  let str = ""; // 組裝成 html結構的str串

  // 參數是陣列 讓他進這跑迴圈    把預寫好物件的格式裝到結構上  checked屬性 辨識該項是否有勾選或未勾選
  array.forEach(function (item, index) {
    // array.forEach((i) => {
    //   str += `<li></li>`;
    // });   // 箭頭函式寫法
    str =
      str +
      `<li data-id="${item.id}">
            <label class="checkbox" for="">
              <input type="checkbox" ${item.checked}/>
              <span>${item.txt}</span>
            </label>
            <a href="#" class="delete"></a>
          </li>`;
  });
  todoList.innerHTML = str; //渲染結果到畫面上
}

// --------------------------------------------------------------
// 新增待辦事項
addClick.addEventListener("click", addTodo);

function addTodo() {
  // 新增待辦事項 不會只新增一個字串上去 會是一包物件
  let todo = {
    txt: inputText.value, // 輸入事項
    id: new Date().getTime(), // 抓獨特項目 刪除或切換狀態用的
    checked: "", // 判別已完成 待完成項目的
  };

  // 按下 add btn click 要把那包物件 丟到 陣列內
  // 也因為增加時東西會在前面 而不該用push 前面排進陣列unshift

  // todoData.unshift(todo);    // 點擊監聽事件就執行 把todo這包物件從陣列前面塞進去
  // console.log(todoData)      // 東西測試有沒有

  if (todo.txt != "") {
    // 如果不是空的(有內容輸入) 才可以新增進來
    todoData.unshift(todo); // 點擊監聽事件就執行 把todo這包物件從陣列前面塞進去
    inputText.value = ""; // 輸入進陣列後 輸入框清空
  }
  // render(todoData);
  updateList();
}

// --------------------------------------------------------------
// tab切換 (active的css樣式)

let toggleStatus = "all"; // 全域狀態  用來裝點到的tab
// 下面func 根據我們點到的去切換 toggleStatus

const tab = document.querySelector(".tab"); // 監聽父層
tab.addEventListener("click", tabChange);

function tabChange(e) {
  // console.log(e.target.dataset.tab) // 用這個
  // console.log(e.target.nodeName)    // 這個不能用XD 抓的都是LI
  toggleStatus = e.target.dataset.tab; // 根據我們點到的去賦值切換toggleStatus

  // 迅速的把li calss 移除 點選到才對點選到的裝上 active
  // 也就變成每次點都很快的移除全部 再裝上點到的那個active
  let tabClear = document.querySelectorAll(".tab li");
  tabClear.forEach((item) => {
    item.classList.remove("active"); //刪掉叫做active的class
  });
  e.target.classList.add("active"); //裝上叫做active的class

  updateList();
}

// --------------------------------------------------------------
// 刪除 及 切換 checked 狀態

todoList.addEventListener("click", deleteAndChecked);
// 因為要執行刪除及打勾可以被check的部份 所以我們要監聽這個ul待辦內容的範圍
// 監聽我們增加的待辦 進行刪除和切換 我們剛才做渲染時就已經先宣告過 宣告過的節點拿來用

function deleteAndChecked(e) {
  // 我們做刪除或切換狀態都必須get到id 那是該物件項目的獨特標記
  // 版型問題是 id是綁在li上面比較方便 點文字是點到input 點叉叉則是a標籤 點不到li
  // 取不到li 這裡就得多寫 離點到位置 最近的('li') 他的 dataset 的 id 才取的到id
  let id = e.target.closest("li").dataset.id;
  // console.log(id) 測試可否取到

  // 來判斷點到是delete還是input    delete有個class叫delete
  if (e.target.classList.value == "delete") {
    e.preventDefault(); // 因為原本是a標籤 先把他的預設取消掉

    // todoData = todoData.filter((item) => item.id != id)
    todoData = todoData.filter(function (item) {
      return item.id != id;
      // id一樣的被過濾掉 就等於刪除的意思
      // 因為有id 不怕刪錯 不會像splice要去算賦予的index id第幾筆

      // 陣列 id 不等於id 嗎
      // 例如點選到的是id:16   ,,  篩選開始 陣列16 不等於 16嗎
      // 答案是false 因次他不會被重新賦值進去todoData的陣列 等同刪除
      // filter true值留下  ,, 刪掉以外的會留下 (filter比對返回陣列不包含點到的那筆)
    });
  } else {
    // 不然就執行 切換打勾沒勾狀態
    // 上面點到if做刪除 下面else 點到 delete以外的做切換勾選狀態功能

    // todoData.forEach((item, index) => {
    // })  箭頭函式寫法

    // 先取出我們點到的那筆 id
    todoData.forEach(function (item, index) {
      if (item.id == id) {
        // 若陣列那筆 等同我點到的那筆
        if (todoData[index].checked == "checked") {
          // 那筆的checked狀態 如果點到的那筆在陣列內的值已經是有checked的話
          // 我們就拿掉 變為沒有任何打勾狀態
          todoData[index].checked = "";
        } else {
          // 相反 若是陣列內那筆是沒有checked狀態中受點擊 就幫他加上checked打勾狀態
          todoData[index].checked = "checked";
        }
      }
    });
  }
  // render(todoData); // 可以做刪除了 Render掛上 執行重新渲染畫面
  updateList();
}

// --------------------------------------------------------------
// 更新待辦事項的分類清單(依照有勾沒勾)

function updateList() {
  let showData = []; //放filter結果的陣列

  // 上面寫切換tab時展現css 有去抓出目前點到位置狀態
  // 如當前被賦予中的全域狀態變數為all之類的
  if (toggleStatus == "all") {
    showData = todoData; // 當前的showData 會等於陣列全部的物件東西
  } else if (toggleStatus == "ing") {
    // 若是點選待完成(進行中的) 就要讓陣列去跑filter 抓他有沒有被打勾

    // showData = todoData.filter((item) => item.checked == '');
    showData = todoData.filter(function (item) {
      return item.checked == "";
      // 從todoData陣列中抓出回傳 沒有被checked打勾狀態的到showData
    });
  } else {
    // 最後以完成的
    showData = todoData.filter(function (item) {
      return item.checked == "checked";
      // 從todoData陣列中抓出回傳 有checked打勾狀態的到showData
    });
  }

  // 待完成幾項
  const ingNum = document.querySelector(".ingNum");

  // 待完成項目就是上面if內那段ing的長度
  let ingLength = todoData.filter(function (item) {
    return item.checked == "";
  }); // 新陣列 內容物為 待完成物件數量

  ingNum.textContent = ingLength.length;

  render(showData);
}
// 丟到外面進行一個初始
updateList();

// --------------------------------------------------------------
// 清除全部有打勾已完成的項目
const clearFin = document.querySelector(".clearFin");
clearFin.addEventListener("click", function (e) {
  e.preventDefault(); // a標籤 先取消預設行為

  // todoData = todoData.filter((item) => item.checked != "checked");
  todoData = todoData.filter(function (item) {
    return item.checked != "checked";
  });
  updateList();

  // 陣列做filter 陣列item內單項物件的checked
  // 抓出有無勾選checked的篩選 跟上面刪除單項的判斷有點類似
  // 假如有打勾(已完成) 不等於已完成嗎 答案是false 因此不會返回todoData陣列
});

// --------------------------------------------------------------
// Enter press 新增方式

// 監聽文字欄位處的動作是 keypress 執行func 如果 e動作的key是enter按鈕的話
// 就進行新增這個函式 addTodo();
inputText.addEventListener("keypress", function (e) {
  if (e.key == "Enter") {
    addTodo();
  }
});

// 獨立函式呼叫方便
// 匿名函式只是其他地方無法呼叫同一個function
