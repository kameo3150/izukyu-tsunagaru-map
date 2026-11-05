# Outside-Izu winter illumination guide — 2026-11-05

User requested dog-friendly events outside Izu, including illuminations. Base65c18f47ffeb2b4836266cd0580ece09d893c025. Added an explicitly labeled outside-Izu feature, homepage entry, site-map category and XML sitemap entry. No SNS posts or A8 link creation. Existing consent-based analytics retained; official link clicks use DogMetrics.track only when permitted.

Official sources checked Nov5:
- https://www.tokinosumika.com/illumination/ — Oct9,2026–Mar7,2027; winter light-up hours.
- https://www.tokinosumika.com/news/8756/ — free-area dog walks; large25kg/60cm prohibited; short lead and manners wear; indoors prohibited. Weight/height boundary cases referred to venue.
- https://www.tokinosumika.com/activity/fountain/ — fountain area pets prohibited. Do not describe all paid illuminations as dog-friendly.
- https://hamamatsu-fp.co.jp/eventinfo/detail/253 — Oct30–Feb28; afterJan11 weekends/holidays;1800yen adult; normal dogs<=50cm except large-dog puppies. Exact50cm differs from other official page and is disclosed.
- https://hamamatsu-fp.co.jp/eventinfo/detail/254 — large dogs Nov14–30,Dec19–Jan11;17–20,last19:30; no daytime; dogfree; consent signed/digital; fountain viewing standing with dog, no seat area. No claim extended hours apply to large dogs.
- https://www.sagamiko-resort.jp/illumillion/summary/ — Nov14–May9; afterApr5 weekends/holidays; adults2000/2400; dog1000,second+500.
- https://www.sagamiko-resort.jp/illumillion/pet/index.html — signed rules; lift held dogs<25kg with16+adult, dogliftfree after16; does not mean all dogs can ride.
- linked official dog rules PDF — indoor gate/shops require face-enclosed cart/cage; vaccine, materials, not left unattended.
- https://www.motherfarm.co.jp/information/illumination2026/ — Oct31–Feb28 weekends/holidays andDec24–Jan4;16–19:30; adult900,child450,dogfree,parkingfree after16. Dog cannot accompany all-you-can-eat menu; outdoor cafeteria option.
- https://www.motherfarm.co.jp/service/pet/ — signed rules; no retractable lead; excluded buildings/animal areas. No blanket statement all activities accept dogs.

All facts from public official web pages, no calls or visits. No blanket dog-friendly accommodation claim or booking earnings claim. Outside-Izu venues are kept out of the Izu regional facility search.

## Booking route added after user instruction
Reused the already generated Jalan general booking A8 ad2TN3WM+E0A98Y+14CS+64JTE unchanged (top and bottom). Added ad disclosure and existing booking.js for affiliate_click. Explicitly labels destination as the general booking page without region/dog filters or a specific hotel. No new A8 code fabricated. Existing official event links remain plain links. Hotel-specific ads require creation in A8; current browser presents login form. Candidate hotels still being verified: Gotemba300381, Hamanako323701, Sagamiko309655, Futtsu327856. Do not claim new hotel ads are installed yet.

## Hotel links completed
A8 sign-in succeeded. Four actual links generated using the official goods-link form with 犬と伊豆 selected, then captured without modifying their URL parameters. Added corresponding hotel booking blocks to all four venue cards, including disclosure, sources and limitations. JSON stores the generated href and pixel URLs. Partnership screen confirms Jalan lodging program active, nominal1% of reservation amount excluding tax; earnings remain contingent on its approval conditions, not clicks.
Gotemba dinner plan04292351 explicitly lists dogs,2 dogs,4000yen each,18:30 delivered meal, size/area restrictions. Hamanako plans include dog-welcome meals/room-only/breakfast; venue transfer not timed. PICA official confirms pet lodging but the fetched Jalan plan list does not independently identify a current dog room, so users are explicitly told to confirm/select an eligible cabin before booking; no blanket room promise. Smith official verifies2 pets,7 guests,vaccines,bath/bedding exclusion; Jalan lists petOK plan. No room availability promise.


## 宿泊比較の追加
- ページ上部の総合予約広告を、4宿の比較カードに変更。宿泊形式・犬の条件・食事・会場との関係と、宿別のA8予約リンクを一緒に表示。スマホは1列。
- A8発行済みのURL・ピクセルをそのまま再利用し、比較部分のクリック位置だけ個別に識別。未確認のサイズ・料金は断定せずプラン確認と表記。予約成果・GA4実受信は未検証。


## 予約導線の再確認・改善（2026-11-05）
- main ab115af85e02ffd054230b62d302fedfe0e9348fを基準に再確認。A8の掲載サイト「犬と伊豆」を選んだ公式商品リンクフォームで、浜名湖・相模湖・富津の3リンクを再発行。生成URLは無加工で使用。新URL・素材は winter-direct-ads-2026-11-05.json に保存。
- 4宿すべて犬同伴のプラン詳細へ進む。相模湖はplan04256414・客室0613411「絶景テラスPAW!!」の犬同室・朝食付き・専用ドッグランをじゃらん実画面で確認。チェックイン14〜18時。設備欄のケージ記載と本文の持参指定が異なるため、持参を案内。
- 浜名湖はplan03373992・客室0599614の素泊まり。犬サイズ別追加料金・15〜22時チェックインを確認。紹介客室は1〜2名用のダブル。別客室の予約導線を残し、空室を保証しない。
- 富津はplan03528216・客室0529774、7名定員・2頭無料の一棟貸しを確認。
- 3つの新A8広告リンクを経由して指定のプラン・客室へ移動することを実ブラウザで確認。予約・購入は実行していない。テストクリックは外部訪問者の成果に数えない。
- スマホ相当のiframe幅390px（スクロールバーを除く実内容375px）で描画。文書幅375px・内容幅375px、比較カード343px、予約ボタン301×87px。横はみ出しなし。スマホ実機・実タッチは未確認。
- 実ソースの共通analytics.jsとbooking.js、今回の8か所のCTAを組み合わせたNode統合テストを追加。14件合格（計測同意・拒否・撤回・所有者除外・重複読込・広告判定）。これはブラウザ送信・GA4実受信の証明ではない。
- Windsor get_connectors/get_fields/get_dataでproperty555642566とG-KT9SG4RDYR・Asia/Tokyoを照合。11/3中伊豆affiliate_click1件、11/4年末年始特集2件を受信済みと確認。本人/制作確認との区別は未確認。
- 最新raw取得開始は2026-11-05T13:01:26 UTC（22:01:26 JST）。11/5の別特集のイベントまであるが、イルミ特集の行は未取得。新ボタンのGA4実受信は未確認。空行をゼロ、doneをGA4確定と扱わない。
- A8の実予約に対する成果発生・承認は未確認。空室・予約成立・報酬保証を表示しない。

### 公開後の最終確認
- 対象公開コミット13e880dec2ee90bb9f7689b170d0ba29a33d6f49。GitHub Pagesのデプロイ成功と、公開ページの新しいPAW予約ボタン2か所を確認。
- iframe320px（内容305px）でも文書幅＝内容幅305px、横はみ出しなし。390px幅と併せて確認。実機ではない。
- 公開ページでutm_source=qa&utm_medium=test&utm_campaign=booking_check_20261105を付け、同意後にPAWの比較ボタンを1回操作。GAタグの読み込み1本をDOMで確認。サイト由来のコンソールエラーは確認されず、拡張機能由来のメタデータエラーのみ。
- 操作後、制作ブラウザの運営者除外を有効にし、計測拒否へ戻した。本人のスマホ等、別端末の設定が完了したとは扱わない。
- Windsorで新特集の当日イベントを強制更新しようとしたが、TRIAL契約でforce_refresh不可と応答。キャッシュ取得では当該ページのイベント行なし。新ボタンの実受信は未確認（ゼロとはしない）。有料契約の変更・勧誘は行っていない。
- 今回の広告到達確認は制作テスト。A8のテストクリックを自然流入や予約成果に数えない。予約・宿泊・成果承認の検証は実取引を伴うため未実施。
