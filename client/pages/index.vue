<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-select v-model="platForm" :items="platFormList" placeholder="プラットフォーム名" item-text="name">
        <template v-slot:item="{item,on,attrs}">
          <v-list-item v-on="on" v-bind="attrs">
            <v-list-item-icon>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{item.name}}</v-list-item-content>
          </v-list-item>
        </template>
      </v-select>
      <v-text-field v-model="userName" placeholder="ユーザID" @keydown.enter="goProfile">
      </v-text-field>
      <v-btn outlined color="primary" @click="goProfile" :disabled="!platForm || !userName" :loading="loading">
        プロファイルを表示
      </v-btn>
    </v-col>
    <v-snackbar v-model="snackBar">
      ユーザが見つかりません
    </v-snackbar>
  </v-row>
</template>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";

export default {
  methods:{
    async goProfile(){
      this.loading = true;
      let data = await fetch(`/api/profile/?userName=${this.userName}&platForm=${this.platForm}`);
      let obj = await data.json();
      this.loading = false;
      if(obj.error){
        this.snackBar = true  
        return;
      }
      this.$router.push(`/profile/${this.platForm}/${this.userName}`)
    }
  },
  data() {
    return {
      platForm: null,
      userName:null,
      loading:false,
      snackBar:false,
      platFormList: [
        {
          name: "PSN",
          icon: "mdi-sony-playstation",
          value: "psn",
        },
        {
          name: "Origin",
          icon: "mdi-origin",
          value: "origin",
        },
        {
          name: "Xbox",
          icon: "mdi-microsoft-xbox",
          value: "xbl",
        },
      ],
    };
  },
};
</script>
