import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PYTHON_URL } from "../../../constants/appConst";

const ControlScreen = () => {
  //조회된 지정 데이터를 저장할 state 변수
  const [sensorData, setSensorData] = useState({
    temp: null,
    air: null,
    ill: null,
  });

  const router = useRouter();

  // 데이터 가져오기 함수 분리
  const fetchSensorData = async () => {
    try {
      console.log("데이터 요청 시작...");
      console.log("요청 URL:", `${PYTHON_URL}/selectAllData`);

      const response = await axios.get(`${PYTHON_URL}/selectAllData`);

      console.log("서버 응답 성공:", response.data);

      // 응답 데이터 검증
      if (response.data && typeof response.data === "object") {
        setSensorData(response.data);
      } else {
        console.log("응답 데이터가 유효하지 않음:", response.data);
        alert("서버에서 유효하지 않은 데이터를 받았습니다.");
      }
    } catch (error) {
      console.log("=== 에러 상세 정보 ===");
      console.log("요청 URL:", `${PYTHON_URL}/selectAllData`);
      console.log("에러 전체:", error);

      if (error.response) {
        console.log("응답 상태:", error.response.status);
        console.log("응답 데이터:", error.response.data);
        alert(
          `서버 오류: ${error.response.status}\n${
            error.response.data || "알 수 없는 오류"
          }`
        );
      } else if (error.request) {
        console.log("네트워크 에러 - 요청:", error.request);
        console.log("네트워크 에러 - 코드:", error.code);
        alert(
          `Python 서버 연결 실패\nURL: ${PYTHON_URL}\n서버가 실행 중인지 확인해주세요.`
        );
      } else {
        console.log("설정 에러:", error.message);
        alert("데이터 요청 중 오류가 발생했습니다.");
      }
    }
  };

  //컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    fetchSensorData();
  }, []);

  return (
    <SafeAreaView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Text style={styles.title}>축사 기기 제어</Text>

      <View style={styles.control}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/fanControl")}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>환기 팬</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>

              <Text style={styles.label}>지정 온도</Text>

              <Text style={styles.value}>{sensorData.temp}°C</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>

              <Text style={styles.label}>지정 공기질</Text>

              <Text style={styles.value}>{sensorData.air} ppm</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/ledControl")}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>LED</Text>
          </View>
          <View style={styles.cardContentCentered}>
            <View style={styles.infoRowSpaced}>
              <Text style={styles.label}>지정 조도</Text>
              <Text style={styles.value}>{sensorData.ill} lux</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.imageSection}>
        <Image
          source={require("@/assets/images/adminHeader.png")}
          style={styles.image}
        />
      </View>
    </SafeAreaView>
  );
};

export default ControlScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  control: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
  },
  cardContent: {
    padding: 20,
  },
  cardContentCentered: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  infoRowSpaced: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: "#757575",
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#eeeeee",
    marginVertical: 4,
  },
  imageSection: {
    marginTop: "auto",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
});
