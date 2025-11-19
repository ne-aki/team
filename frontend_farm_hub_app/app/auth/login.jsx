import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import PageTitle from "@/components/common/PageTitle";
import { SERVER_URL } from "@/constants/appConst";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const router = useRouter();

  // 로그인 정보
  const [loginData, setLoginData] = useState({
    memId: "",
    memPw: "",
  });

  const loginNow = async () => {
    if (!loginData.memId.trim() || !loginData.memPw.trim()) {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요');
      return;
    }
    try {
      const res = await axios.get(`${SERVER_URL}/members/login`, {
        params: loginData,
      });

      console.log("응답 데이터:", res.data);

      if (res.data) {
        // 로그인한 id, 이름, 권한 정보만을 갖는 객체를 별도로 생성
        const loginInfo = {
          memId: res.data.memId,
          memName: res.data.memName,
          memRole: res.data.memRole,
        };

        console.log("로그인 정보:", loginInfo);

        // SecureStore에 저장
        await SecureStore.setItemAsync("loginInfo", JSON.stringify(loginInfo));

        if (router.canDismiss()) {
          router.dismissAll();
        }

        // ※ 유저인지 관리자인지
        if (res.data.memRole === "ADMIN") {
          router.replace("/");
        } else {
          setLoginData({
            memId: "",
            memPw: "",
          });
          router.replace("/product");
        }
      } else {
        Alert.alert("로그인 실패", "ID 혹은 비밀번호가 일치하지 않습니다");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      console.error("에러 상세:", error.response?.data);

      // 401 에러 또는 다른 에러 처리
      if (error.response) {
        // 서버가 응답을 반환한 경우
        if (error.response.status === 401) {
          Alert.alert(
            "로그인 실패",
            error.response.data || "ID 혹은 비밀번호가 일치하지 않습니다"
          );
        } else {
          Alert.alert("오류", "로그인 중 오류가 발생했습니다");
        }
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        console.error("요청 에러:", error.request);
        Alert.alert("연결 오류", "서버와의 연결에 실패했습니다");
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error("설정 에러:", error.message);
        Alert.alert("오류", "요청 중 오류가 발생했습니다");
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <PageTitle title="로그인" />
        <View style={styles.content}>
          <View style={{ marginBottom: 13}}>
            <Input
              name="memId"
              value={loginData.memId}
              label="아이디"
              placeholder="아이디를 입력하세요"
              onChangeText={(text) => {
                setLoginData({ ...loginData, memId: text });
              }}
              returnKeyType="next"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={{ marginBottom: 9 }}>
            <Input
              name="memPw"
              value={loginData.memPw}
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              isPw={true}
              onChangeText={(text) => {
                setLoginData({ ...loginData, memPw: text });
              }}
              onSubmitEditing={loginNow}
              returnKeyType="done"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={{ marginBottom: 7 }}>
            <Button onPress={loginNow} title="로그인" />
          </View>

          <Pressable
            style={styles.joinLink}
            onPress={() => {
              if (router.canDismiss()) {
                router.dismissAll();
              }
              router.replace("/auth/join");
            }}
          >
            <Text style={styles.joinText}>회원가입</Text>
          </Pressable>
          <Pressable
            style={styles.joinLink}
            onPress={() => {
              if (router.canDismiss()) {
                router.dismissAll();
              }
              router.replace("/auth/forgotPw");
            }}
          >
            <Text style={styles.joinText}>비밀번호 찾기</Text>
          </Pressable>
          <Pressable
            style={styles.joinLink}
            onPress={() => {
              if (router.canDismiss()) {
                router.dismissAll();
              }
              router.replace("/product");
            }}
          >
            <Text style={styles.joinText}>메인화면</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingRight: 15,
    paddingLeft: 15,
  },
  content: {
    paddingRight: 15,
    paddingLeft: 15,
    marginTop: 11,

  },
  joinLink: {
    alignItems: "flex-end",
  },
  joinText: {
    textDecorationLine: "underline",
  },
});
