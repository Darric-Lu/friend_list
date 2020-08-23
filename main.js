
const newFriendsList = document.querySelector('#new-firends-list')
const paginator = document.querySelector('#paginator')
const searchInput = document.querySelector('#Seach-input')
const searchForm = document.querySelector('#Search-form')
const modeBtn = document.querySelector('#mode-btn')
const genderBtn = document.querySelector('.btn-gender')
const changeNameBtn = document.querySelector('.dropdown-menu')
const total = document.querySelector('#total')
const regionBtn = document.querySelector('.region-btn')
const regionList = document.querySelector('.region-list')
const addFavouriteList = document.querySelector('#addFavourite')
const LIST_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users'
const FRIENDS_PER_PAGE = 12
const newFriends = []
let filteredFriends = []
let regions = []
let currentPage = 1
let numberOfPages = 0
let mode = 'cardMode'
let changeNameFilter = 'name'
let genderStatus = 0

function renderData(data) {//渲染畫面
  let listHTML = ''
  if (mode === 'cardMode') {
    data.forEach(e => {
      listHTML += `
    <div class="col-sm-6 col-md-3">
      <div id="${e.id}" class="m-2 target">
        <div id="${e.id}" class="card card-content target" data-toggle="modal" data-target="#list-modal">
          <img id="${e.id}" src="${e.avatar}" class="card-img target" alt="friend picture">
            <div id="${e.id}" class="card-body" >
              <span class="card-name target" id="${e.id}">${e.name}</span>
              <span class="card-surname target" id="${e.id}">${e.surname}</span>
            </div>
        </div>
      </div>
    </div>`
    })
  } else if (mode === 'listMode') {
    data.forEach(e => {
      listHTML += `
        <div id="${e.id}" class="col-sm-12 col-md-12 col-lg-6 target">
          <div id="${e.id}" class="m-2 target">
            <div id="${e.id}" class="card card-content card-content target" data-toggle="modal" data-target="#list-modal"">
              <div id="${e.id}" class="row d-flex align-items-center target">
                <div id="${e.id}" class="col-4 target">
                  <img src="${e.avatar}" class="card-img target" alt="friend picture" id="${e.id}">
                </div>
                <div id="${e.id}" class="col-4 target">
                  <span class="card-name target" id="${e.id}"><h5>${e.name}</h5></span>
                  <span class="card-surname target" id="${e.id}"><h5>${e.surname}</h5></span>
                </div>
                <div id="${e.id}" class="col-4 target">
                  <span class="card-gender target" id="${e.id}">Gender:${e.gender}</span>
                  <span class="card-region target" id="${e.id}">Region:${e.region}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    })
  }
  newFriendsList.innerHTML = listHTML
  countTotal()
}
function renderPagintor(amount) {//渲染分頁器
  numberOfPages = Math.ceil(amount / FRIENDS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" data-page="${page}" href="#">${page}</a></li>`
    paginator.innerHTML = rawHTML
  }
}
function renderModal(data) {// 抽換modal資料並渲染
  document.querySelector('#modal-id').innerHTML = data.id
  document.querySelector('#modal-name').innerText = `Name：${data.name} ${data.surname}`
  document.querySelector('#modal-gender').innerText = `Gender：${data.gender}`
  document.querySelector('#modal-region').innerText = `Region：${data.region}`
  document.querySelector('#modal-birthday').innerText = `Birthday：${data.birthday}`
  document.querySelector('#modal-email').innerText = `Email：${data.email}`
  document.querySelector('.image-fuid').src = data.avatar
}
function onListClicked(e) {//點擊卡片
  if (e.target.matches('.target')) {
    const event = newFriends.find((itme) => itme.id === Number(e.target.id))
    renderModal(event)
  }
}
function onPaginatorClick(event) {//點擊Pagintor按鈕 
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  currentPage = Number(event.target.dataset.page)
  renderData(getFriendsByPage(page))
}
function onSearchClicked(event) {//輸入搜尋
  event.preventDefault()
  genderStatus += 1 //校正UX
  const keyword = searchInput.value.trim().toLowerCase()
  filteredFriends = filteredFriends.length ? filteredFriends : newFriends
  if (changeNameFilter === 'name') {
    filteredFriends = filteredFriends.filter(Friend => Friend.name.toLowerCase().includes(keyword))
  } else if (changeNameFilter === 'surname') {
    filteredFriends = filteredFriends.filter(Friend => Friend.surname.toLowerCase().includes(keyword))
  }
  if (filteredFriends.length === 0) {
    alert(`您輸入的關鍵字：${keyword} 沒有符合條件的名子\n 回到總名單`)
    backToAll()
    return
  }
  renderPagintor(filteredFriends.length)
  renderData(getFriendsByPage(1))
  countTotal()
  searchInput.value = ''
}
function changeName(e) {//選擇name / surname
  if (event.target.tagName !== 'A') return
  const value = document.querySelector('.dropdown-toggle')
  if (e.target.id === "name") {
    changeNameFilter = 'name'
  } else if (e.target.id === "surname") {
    changeNameFilter = 'surname'
  }
  value.innerHTML = changeNameFilter
}
function filterGender(e) {//篩選性別
  const gender = e.target.id

  if (genderStatus === 0) {
    filteredFriends = filteredFriends.filter((e) => e.gender === gender).length ? filteredFriends : newFriends
    filteredFriends = filteredFriends.filter((e) => e.gender === gender)
  } else if (genderStatus > 0) {
    filteredFriends = filteredFriends.filter((e) => e.gender === gender)
    if (filteredFriends.length === 0) {
      window.alert(`性別搜尋錯誤\n 回到總名單`)
    }
  }
  let amount = filteredFriends.length ? filteredFriends.length : newFriends.length
  renderData(getFriendsByPage(1))
  renderPagintor(amount)
  countTotal()
}
function switchDisplay(e) {//變換顯示
  if (e.target.matches('.fa-bars')) {
    mode = 'listMode'
  } else if (e.target.matches('.fa-th')) {
    mode = 'cardMode'
  }
  renderData(getFriendsByPage(currentPage))
}
function getFriendsByPage(page) {// 獲取分頁12筆資料
  const data = filteredFriends.length ? filteredFriends : newFriends
  const startIndex = (page - 1) * FRIENDS_PER_PAGE
  return data.slice(startIndex, startIndex + FRIENDS_PER_PAGE)
}
function getApiData() {//獲取資料並保存至localStorage
  const allFriends = JSON.parse(localStorage.getItem('allFriends')) || []
  if (allFriends.length === 0) {
    axios.get(LIST_URL).then(res => {
      newFriends.push(...res.data.results)
      localStorage.setItem('allFriends', JSON.stringify(newFriends))
    })
  } else {
    newFriends.push(...JSON.parse(localStorage.getItem('allFriends')))
  }
  renderData(getFriendsByPage(1))
}

function backToAll() {//回復全部列表
  getApiData()
  renderPagintor(newFriends.length)
  countTotal()
}
function countTotal() {//計算朋友數
  let count = filteredFriends.length ? filteredFriends.length : newFriends.length
  let listHTML = `Friends <h5><span class="badge badge-pill badge-info">${count} people</span><h5>`
  total.innerHTML = listHTML
}
function filterRegionAra() {//篩選區域列表
  let data = filteredFriends.length ? filteredFriends : newFriends
  const dataList = []
  data.forEach(e => {
    dataList.push(e.region)
  })
  dataList.filter(e => !regions.includes(e) ? regions.push(e) : false)
}
function renderRegionAra() {//渲染區域
  filterRegionAra()
  let listHTML = ''
  regions.forEach(e => {
    listHTML += `
    <a class="dropdown-item" id="${e}">${e}</a>
    `
  })
  regionList.innerHTML = listHTML
}
function filterRegion(e) {//以區域篩選
  genderStatus += 1 //校正UX
  const region = e.target.id
  filteredFriends = filteredFriends.length ? filteredFriends : newFriends
  filteredFriends = filteredFriends.filter((e) => e.region === region)
  renderData(getFriendsByPage(1))
  renderPagintor(filteredFriends.length)
  countTotal()
  regions = []
}
function addFavourite(e) {//加入我的最愛
  const favoriteFriends = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const friendId = Number(e.target.parentElement.previousElementSibling.firstElementChild.textContent)
  if (favoriteFriends.some((fdId) => fdId.id === friendId)) {
    return alert('已是我的最愛！')
  }
  const allFriends = JSON.parse(localStorage.getItem('allFriends'))
  const event = allFriends.find((itme) => itme.id === friendId)
  favoriteFriends.push(event)
  localStorage.setItem('favoriteFriends', JSON.stringify(favoriteFriends))
}

function init() {// 初始設定
  getApiData()
  renderPagintor(newFriends.length)
}
newFriendsList.addEventListener('click', onListClicked)
paginator.addEventListener('click', onPaginatorClick)
searchForm.addEventListener('submit', onSearchClicked)
modeBtn.addEventListener('click', switchDisplay)
genderBtn.addEventListener('click', filterGender)
changeNameBtn.addEventListener('click', changeName)
regionBtn.addEventListener('click', renderRegionAra)
regionList.addEventListener('click', filterRegion)
addFavouriteList.addEventListener('click', addFavourite)


init()

