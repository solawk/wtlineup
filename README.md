# WTLineup - War Thunder Simulator Lineups / Сетапы СБ War Thunder  

## English  
WTLineup allows War Thunder players to access the lists of vehicles in specific simulator battles lineups.  
The application also includes:  
* searching for specific vehicles and accessing the lineups they are present in  
* currently and next available lineups with a rotation timer  
* reporting system for the players to report missing vehicles, incorrect information or bugs in the application  
* normal link https://solawk.github.io/wtlineup/ and short link https://bit.ly/wt-sim  
* links directly to specific lineups by adding a "select" parameter, e.g. https://solawk.github.io/wtlineup/?select=4_1  

WTLineup initially uses the War Thunder Wiki for the vehicle lists and their information by scraping its contents.  
Application uses Google Sheets and Apps Script for data storage and access. After the data is loaded for the first time, it's stored in your device until you clear the browser's local storage. You can refresh the data with an according button.
If you are using the application on a mobile device and the website receives an update, you may need to clear your browser's cache for the application to display correctly.

## Русский
WTLineup позволяет игрокам War Thunder просмотреть списки техники в сетапах симуляторных боёв.  
Приложение также включает в себя:
* поиск определённых единиц техники и прямой доступ к сетапам, в которой они расположены  
* текущие и следующие сетапы с таймером до ротации  
* система репортов, позволяющая игрокам оповестить о недостающей технике, некорректной информации или ошибках в приложении  
* обычная ссылка https://solawk.github.io/wtlineup/ и короткая ссылка https://bit.ly/wt-sim  
* прямые ссылки на определённые сетапы при помощи параметра "select", например https://solawk.github.io/wtlineup/?select=4_1  

WTLineup изначально использует вики War Thunder в качестве источника информации о технике путём скрейпинга её содержимого.  
Приложение использует Google Таблицы и Apps Script для хранения данных и доступа к ним. После первой загрузки данных, они хранятся в вашем устройстве, пока вы не очистите локальное хранилище браузера. Вы можете обновить данные с помощью соответствующей кнопки.  
Если вы используете приложение на мобильном устройстве и происходит обновление сайта, вам может потребоваться очистить кэш браузера, чтобы приложение могло отображаться корректно.

Changes:  
(16.05.2023)
* Search window vehicle names are also links like in the table
* Clicking on a nation flag at the top will show only the vehicles of that nation. Click it again to disable the filter

(13.04.2023)
* Names of vehicles are now links to searching them in Google  
* Future lineups are now accessible in the schedule section  

(11.04.2023)
* Schedule is now at the top as a third top cell. Font sizes readjusted  
* Swapped blue and red teams according to how they appear in-game  
* Cursor will now look like a pointer when hovering above team table headers to indicate a presence of functionality (sorting by selected header)  
* Added flags to indicate which nations participate in which team in the selected lineup  
* Links in the bottom-right corner are now displayed more explicitly  
* kity  