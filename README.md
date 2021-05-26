## simple comment with vanilla js

프론트엔드 관련 라이브러리 사용을 배제하고 js, css, html만 이용해서 comment기능을 구현해보았습니다.  
vanilla js로 코딩을 해보니, 지금까지보다 html구조에 더 신경을 써야 한다는 것을 깨닳게 해주는 작업이었습니다.  
현재 등록되어있는 금칙어는 아래와 같습니다.

<img src="https://user-images.githubusercontent.com/38380280/119617848-30721f00-be3d-11eb-9808-61bac7f49281.png" width="800px" alt="금칙어">

### 실행법

1.  git clone

    ```sh
       git clone https://github.com/sa82trip/comment_with_vanilla_js.git
    ```

    or
    download zip file
![image](https://user-images.githubusercontent.com/38380280/119609952-67dbce00-be33-11eb-94cd-62bfe0f41e05.png)
2.  index.html 실행
    -   만약 http-server가 깔려있다면 clone하거나 다운 받아서 zip파일은 푼 디렉터리에서 아래 명령어 실행후 브라우져에서 <http://localhost:8080/> 입력 후 엔터.

        ```sh
             npx http-server
        ```
3.  크롬 개발자 모드 켜서 mobile device로 설정



    <img src="https://user-images.githubusercontent.com/38380280/119610028-8b067d80-be33-11eb-9312-0d9efbb1f7cc.png" width="400">



    toggle mobile device toolbar
    ![image](https://user-images.githubusercontent.com/38380280/119610048-935eb880-be33-11eb-90c3-fecd773ad5eb.png)
    


### 기본 기능


#### comment 작성, 삭제, 수정

-   comment작성을 하려면 로그인을 해야하고, 현재 로그인은 mockData로 간단히 구현하였습니다.
-   email을 기입하고 코멘트 작성 가능(알맞은 email형태로 작성해야합니다.)


#### 금칙어 기능

-   comment에 금칙어가 있는경우 작성이 완료되지 않고, 등록 버튼이 3초간 비활성화 됩니다.


#### 도배방지 기능

-   같은 유저가 comment2개를 초과해서 등록하려는 경우 등록이 되지 않으며 등록 버튼이 3초간 비활성화 됩니다.


#### 좋아요, 싫어요 버튼 기능

-   comment에 대해서 반응을 할 수 있습니다.


### 추가(개선)하고 싶은 기능

-   댓글이 달리면 email이나 해당 sns로 통지를 보내고 싶습니다. (sendgrid 같은 서비스를 이용하거나, mail server구축 필요, 각종 sns의 api이용)
-   금칙어 DB를 가지고 있으면 좀 더 그럴듯 할 것 같습니다.
-   도배방지 기능에 2개를 연속으로 입력한 경우만 막고 있는데, 총 comment의 양의 특정 percentage를 넘어가면 막는 다던가, 특정 시간안에 특정 비율 이상의 comment를 작성하면 막는 다던가 하는 로직도 추가하면 좋을 것 같습니다.
-   좋아요, 싫어요를 같은 comment에는 유저당 하나만 달 수 있도록 수정하고 싶습니다.
-   좋아요, 싫어요 숫자등 여러가지 조건으로 sorting이 가능하게 하고 싶습니다.
