let txtYear = document.querySelector("#txtYear");
let selMon = document.querySelector("#selMon");
let selDay = document.querySelector("#selDay");
let msg = document.querySelector("#msg");

//어제 날짜 구하기
function init() {
  //오늘 날짜 확인 - 1day
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate() - 1;

  //1~9월은 앞에 0 추가 / 1~9일 앞에 0추가
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }

  //상단의 날짜 보여주기
  txtYear.value = year;
  selMon = month;
  selDay = day;
}

window.onload = function () {
  init();

  document.querySelector("#bt1").addEventListener("click", getOrder);

  function getOrder() {
    // url 생성
    var url =
      "http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.xml?key=f5eef3421c602c6cb7ea224104795888&targetDt=";

    url += txtYear.value + selMon.value + selDay.value;

    console.log(url);

    // fetch 요청
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("데이터가 없습니다.");
        }
        return response.text();
      })
      .then((data) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");

        dailyBoxOffice = xml.querySelectorAll("dailyBoxOffice");

        let str = "";

        dailyBoxOffice.forEach((item, idx) => {
          //순위
          str += item.querySelector("rank").textContent + " 위";

          //증감
          var rankInten = parseInt(item.querySelector("rankInten").textContent);
          if (rankInten > 0) str += "(^";
          else if (rankInten < 0) str += "(8";
          else str += "(";

          str += rankInten + ") : ";

          //영화코드
          var movieCd = item.querySelector("movieCd").textContent;
          //영화명
          var movieNm = item.querySelector("movieNm").textContent + "<br>";

          str +=
            "<a href='#' onclick='javascript:show(" +
            movieNm +
            ")'>" +
            movieNm +
            "</a>";
        });
        msg.innerHTML = str;

        console.log(dailyBoxOffice);
      })
      .catch((error) => {});
  }
};
