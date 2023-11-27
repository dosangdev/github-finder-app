import { $ } from "./dom.js";

const userImg = $(".avatar");
const reposCount = $(".repos__count");
const gistsCount = $(".gists__count");
const followersCount = $(".followers__count");
const followingCount = $(".following__count");
const userCompany = $(".user__company");
const userBlog = $(".user__blog");
const userLocation = $(".user__location");
const userSince = $(".user__since");
const userPageBtn = $(".view__profile__btn");
const repoListContainer = $("#repoList");
const repoTemplate = $("#repoTemplate");

class UserInfo {
  constructor() {
    this.login = "";
    this.url = "";
    this.avatar_url = "";
    this.public_repos = 0;
    this.company = "";
    this.created_at = "";
    this.location = "";
    this.public_gists = 0;
    this.followers = 0;
    this.following = 0;
    this.blog = "";
    this.html_url = "";
    this.repos_url = [];
  }

  async fetchData() {
    try {
      const res = await fetch(this.url);
      const data = await res.json();

      this.avatar_url = data.avatar_url;
      this.public_repos = data.public_repos;
      this.company = data.company;
      this.created_at = new Date(data.created_at).toLocaleDateString();
      this.location = data.location;
      this.public_gists = data.public_gists;
      this.followers = data.followers;
      this.following = data.following;
      this.blog = data.blog;
      this.html_url = data.html_url;

      const resReposUrl = await fetch(data.repos_url);
      const reposDataArray = await resReposUrl.json();

      this.repos_url = reposDataArray.slice(0, 5);

      this.displayData();
    } catch (err) {
      console.log(err);
    }
  }

  displayData() {
    repoListContainer.innerHTML = "";

    this.repos_url.forEach((repoData, index) => {
      const repoClone = repoTemplate.content.cloneNode(true);
      const repoInnerWrapper = repoClone.querySelector(".repo__inner__wrapper");

      repoInnerWrapper.classList.add(`repo${index + 1}`);
      repoInnerWrapper.style.display = "block";

      const repoTitle = repoInnerWrapper.querySelector(".repo__title");
      repoTitle.textContent = repoData.name;
      repoTitle.addEventListener("click", () => {
        location.href = repoData.html_url;
      });

      const repoStars = repoInnerWrapper.querySelector(".stars");
      repoStars.textContent = `Stars: ${repoData.stargazers_count}`;

      const repoWatchers = repoInnerWrapper.querySelector(".watchers");
      repoWatchers.textContent = `Watchers: ${repoData.watchers_count}`;
      const repoFork = repoInnerWrapper.querySelector(".fork");
      repoFork.textContent = `Forks: ${repoData.fork}`;

      repoListContainer.appendChild(repoClone);
    });
    userImg.src = this.avatar_url;
    reposCount.textContent = `Public Repos: ${this.public_repos}`;
    gistsCount.textContent = `Public Gists: ${this.public_gists}`;
    followersCount.textContent = `Followers: ${this.followers}`;
    followingCount.textContent = `Following: ${this.following}`;
    userCompany.textContent = `Company: ${this.company}`;
    userBlog.textContent = `Website/Blog: ${this.blog ? this.blog : "null"}`;
    userLocation.textContent = `Location: ${this.location}`;
    userSince.textContent = `Since: ${this.created_at}`;
  }
}

const userInfo = new UserInfo();

const searchInput = $("#search__input");

window.addEventListener("load", () => {
  const defaultUser = "dosangdev";
  userInfo.url = `https://api.github.com/users/${defaultUser}`;
  userInfo.fetchData();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    userInfo.url = `https://api.github.com/users/${searchInput.value}`;
    userInfo.fetchData();
  }
});

userPageBtn.addEventListener("click", () => {
  location.href = userInfo.html_url;
});
