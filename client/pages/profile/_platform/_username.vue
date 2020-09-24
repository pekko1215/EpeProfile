<template>
  <div id="profile" v-if="!loading">
    <div id="platForm">
      <div v-if="profile.platformInfo.platformSlug === 'origin'">
        <v-avatar>
          <v-icon large>mdi-origin</v-icon>
        </v-avatar>
        <div class="platform-name">Origin</div>
      </div>

      <div v-if="profile.platformInfo.platformSlug === 'psn'">
        <v-avatar>
          <v-icon large>mdi-sony-playstation</v-icon>
        </v-avatar>
        <div class="platform-name">PSN</div>
      </div>

      <div v-if="profile.platformInfo.platformSlug === 'xbl'">
        <v-avatar>
          <v-icon large>mdi-microsoft-xbox</v-icon>
        </v-avatar>
        <div class="platform-name">XBOX</div>
      </div>
    </div>
    <div id="legend">
      <img :src="legend.metadata.tallImageUrl" />
    </div>
    <div id="userName">{{profile.platformInfo.platformUserHandle}}</div>
    <v-list-item id="rank">
      <v-list-item-avatar width="64" height="64">
        <img :src="userInfo.rankScore.metadata.iconUrl" />
      </v-list-item-avatar>
      <v-list-item-content class="rank-name">
        {{userInfo.rankScore.metadata.rankName}}
        <br />
        Level {{userInfo.level.displayValue}}
      </v-list-item-content>
    </v-list-item>
    <div id="trackers">
      <div class="tracker" v-for="(tracker,idx) in legend.stats.slice(0,3)" :key="idx">
        <div class="tracker-title">{{tracker.displayName}}</div>
        <div class="tracker-value">{{tracker.displayValue}}</div>
        <div class="tracker-rank" v-if="tracker.rank">Global #{{tracker.rank}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#profile {
  width: 950px;
  height: 500px;
  /* border: solid 2px white; */
  position: absolute;
  background: #121212;
}

#platForm {
  position: absolute;
  right: 0;
  top: 0;
  width: 100px;
  text-align: center;
}

#legend {
  position: absolute;
  height: 100%;
  width: 450px;
  left: 0;
  top: 0;
  overflow: hidden;
}

#legend img {
  position: absolute;
  width: 100%;
  opacity: 0.6;
  /* top: -58px; */
}
#userName {
  text-align: right;
  width: 300px;
  position: absolute;
  top: 120px;
  left: 400px;
  font-size: 4em;
}

#trackers {
  height: 150px;
  padding-left: 250px;
  padding-right: 5px;
  width: 100%;
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  margin-bottom: 5px;
}

#trackers .tracker {
  width: 250px;
  height: 70%;
  position: relative;
  margin-right: 5px;
  z-index: 2;
}

#trackers .tracker::before {
  transform: skewX(-10deg);
  border: solid gray 4px;
  content: "";
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  right: 0;
  margin-left: -30px;
  font-size: 16pt;
  background: #121212;
}

#trackers .tracker:nth-child(1) {
  height: 100%;
  width: 300px;
  font-size: 18pt;
}

.tracker {
  text-align: left;
}

.tracker * {
  z-index: 1;
  position: relative;
}

.tracker-title {
  text-align: left;
  margin-left: 20px;
  font-size: 1em;
  margin-top: 5px;
}

.tracker:nth-child(1) .tracker-title {
  font-size: 1em;
}

.tracker-value {
  font-weight: bold;
  position: relative;
  padding-left: 10%;
  margin-top: 5px;
  font-size: 1.2em;
}
.tracker-value::after {
  content: "";
  width: 80%;
  height: 3px;
  border-radius: 1px;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  background-color: darkred;
  bottom: 0;
  z-index: 3;
}

.tracker-rank {
  font-size: 1em;
  color: gray;
  text-align: right;
  padding-right: 10%;
  position: absolute;
  bottom: 0;
  width: 100%;
}

#rank {
  position: absolute;
  right: 50px;
  bottom: 120px;
  width: 335px;
  font-size: 1.5em;
}
</style>
     
<script lang="ts">
import Vue from "vue";
type PlatForm = "psn" | "xbl" | "origin";
interface ResponsedData {
  [key: string]: any;
  metadata: ResponsedData;
}

export default Vue.extend({
  data() {
    return {
      profile: {},
      loading:true
    };
  },
  validate({ params }) {
    return /^(psn|origin|xbl)$/.test(params.platform);
  },
  async mounted() {
    let params = this.$route.params;
    let data = await fetch(
      `/api/profile?platForm=${params.platform}&userName=${params.username}`
    );
    let obj = await data.json();
    if (obj.error) return false;
    // スコアデータが一番多いレジェンドを表示する

    // let legend = obj.data.segments.slice(1).reduce((a: any, b: any) => {
    //   return Object.keys(a.stats).length >= Object.keys(b.stats).length ? a : b;
    // });

    let legend = obj.data.segments[1]

    let stats = Object.keys(legend.stats).map((key) => {
      return legend.stats[key];
    });

    legend.stats = stats.sort((a: any, b: any) => {
      return a.rank - b.rank;
    });
    let userInfo = {
      level: obj.data.segments[0].stats.level,
      kills: obj.data.segments[0].stats.kills,
      rankScore: obj.data.segments[0].stats.rankScore,
    };
    Object.assign(this,{
      profile: obj.data,
      legend,
      userInfo,
    });
    this.loading = false;
  },
});
</script>