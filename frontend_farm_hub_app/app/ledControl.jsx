import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { PYTHON_URL } from "../constants/appConst";

const ledControl = () => {
  //지정 조도를 저장할 state 변수
  const [illuminance, setIlluminance] = useState("");

  //스위치의 on/off 상태를 관리하는 state 변수
  const [isEnabled, setIsEnabled] = useState(false);

  //스위치 동작 중 로딩 상태
  const [switchLoading, setSwitchLoading] = useState(false);

  //현재 LED 상태 정보
  const [ledStatus, setLedStatus] = useState({
    isOn: false,
    mode: "auto", // 'auto' | 'manual'
    lastUpdate: null,
  });

  //현재 설정값들
  const [currentSettings, setCurrentSettings] = useState({
    temp: 0,
    air: 0,
    ill: 0,
  });

  //컴포넌트 마운트 시 현재 상태 가져오기
  useEffect(() => {
    fetchCurrentSettings();
  }, []);

  //현재 설정값 가져오기
  const fetchCurrentSettings = async () => {
    try {
      const response = await axios.get(`${PYTHON_URL}/selectAllData`);
      setCurrentSettings(response.data);
      setIlluminance(response.data.ill.toString());
    } catch (error) {
      console.log("설정값 가져오기 실패:", error);
    }
  };

  //모드 스위치 전환 함수 (자동 ↔ 수동)
  const toggleModeSwitch = async (value) => {
    const newMode = value ? "manual" : "auto";

    try {
      console.log(`LED 모드 변경: ${newMode}`);

      // 자동 모드로 변경 시 수동 제어 스위치 끄기
      if (newMode === "auto") {
        setIsEnabled("OFF");
      }

      setLedStatus((prev) => ({
        ...prev,
        mode: newMode,
        lastUpdate: new Date().toLocaleTimeString(),
      }));

      //실제 API 호출 (Python 서버에 해당 엔드포인트 추가 필요)
      const response = await axios.post(`${PYTHON_URL}/ledMode/${newMode}`);
      console.log("모드 변경 성공:", response.data);

      Alert.alert(
        "모드 변경",
        `LED가 ${newMode === "auto" ? "자동" : "수동"} 모드로 변경되었습니다.`,
        [{ text: "확인" }]
      );
    } catch (error) {
      console.log("모드 변경 에러:", error);
      Alert.alert("오류", "모드 변경에 실패했습니다.", [{ text: "확인" }]);
    }
  };

  //스위치를 누를 때마다 현재 상태를 반전시키는 함수
  const toggleSwitch = async () => {
    if (switchLoading) return; // 이미 처리 중이면 무시

    const newState = !isEnabled;
    setSwitchLoading(true);

    try {
      // LED 제어 API 호출 (Python 서버에 해당 엔드포인트 추가 필요)
      const action = newState ? "ON" : "OFF";
      console.log(`LED ${action} 요청 중...`);

      // 임시로 상태만 변경 (실제 API 연동 시 주석 해제)
      const response = await axios.post(`${PYTHON_URL}/ledControl/${action}`);
      console.log("LED 제어 성공:", response.data)

      // 상태 업데이트
      setIsEnabled(newState);
      setLedStatus((prev) => ({
        ...prev,
        isOn: newState,
        mode: "manual",
        lastUpdate: new Date().toLocaleTimeString(),
      }));

      Alert.alert(
        "LED 제어",
        `LED가 ${newState ? "켜졌습니다" : "꺼졌습니다"}.`,
        [{ text: "확인" }]
      );
    } catch (error) {
      console.log("LED 제어 에러:", error);
      Alert.alert("오류", "LED 제어에 실패했습니다.", [{ text: "확인" }]);
    } finally {
      setSwitchLoading(false);
    }
  };

  //지정 조도 저장 버튼 클릭 시 실행함수
  const regIll = async () => {
    // 입력값 검증
    if (!illuminance || illuminance.trim() === "") {
      Alert.alert("알림", "조도 값을 입력해주세요.");
      return;
    }

    const numValue = parseFloat(illuminance);
    if (isNaN(numValue) || numValue < 0) {
      Alert.alert("알림", "유효한 조도 값을 입력해주세요. (0 이상의 숫자)");
      return;
    }

    try {
      console.log("조도 설정 요청:", numValue);
      const response = await axios.post(`${PYTHON_URL}/decideIll/${numValue}`);

      Alert.alert("성공", "조도가 저장되었습니다.");

      // 설정 후 현재 값 다시 가져오기
      fetchCurrentSettings();
    } catch (error) {
      console.log("조도 설정 에러:", error);
      Alert.alert("오류", "조도 설정에 실패했습니다.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>상세 설정</Text>

        {/* 현재 상태 표시 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>현재 LED 상태</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>전원:</Text>
              <View
                style={[
                  styles.statusBadge,
                  ledStatus.isOn ? styles.statusOn : styles.statusOff,
                ]}
              >
                <Text style={styles.statusText}>
                  {ledStatus.isOn ? "ON" : "OFF"}
                </Text>
              </View>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>모드:</Text>
              <View style={styles.modeSwitch}>
                <Text style={styles.modeLabel}>자동</Text>
                <Switch
                  trackColor={{ false: "#4CAF50", true: "#FF9800" }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#4CAF50"
                  onValueChange={toggleModeSwitch}
                  value={ledStatus.mode === "manual"}
                  style={styles.modeSwitchComponent}
                />
                <Text style={styles.modeLabel}>수동</Text>
              </View>
            </View>
            {ledStatus.lastUpdate && (
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>마지막 업데이트:</Text>
                <Text style={styles.statusValue}>{ledStatus.lastUpdate}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>LED를 킬 조도를 입력해주세요.</Text>
          <Text style={styles.currentValue}>
            현재 설정: {currentSettings.ill} lux
          </Text>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="조도 (lux)"
                value={illuminance}
                onChangeText={(text) => setIlluminance(text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                title="저장"
                style={styles.button}
                onPress={() => regIll()}
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.sectionTitle}>LED 수동 제어</Text>
              <Text style={styles.switchSubtext}>
                {ledStatus.mode === "auto"
                  ? "자동 모드에서는 수동 제어가 비활성화됩니다"
                  : switchLoading
                  ? "처리 중..."
                  : isEnabled
                  ? "LED가 수동으로 켜져 있습니다"
                  : "LED가 수동으로 꺼져 있습니다"}
              </Text>
              <Text style={styles.switchNote}>
                {ledStatus.mode === "auto"
                  ? "위의 모드 스위치를 수동으로 변경하면 제어할 수 있습니다."
                  : "수동 모드에서 LED를 직접 제어할 수 있습니다."}
              </Text>
            </View>
            <View style={styles.switchContainer}>
              {switchLoading ? (
                <ActivityIndicator size="small" color="#be5050ff" />
              ) : (
                <Switch
                  trackColor={{ false: "#d1d5db", true: "#be5050ff" }}
                  thumbColor={isEnabled ? "#ffffff" : "#ffffff"}
                  ios_backgroundColor="#d1d5db"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                  style={styles.switch}
                  disabled={switchLoading || ledStatus.mode === "auto"}
                />
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ledControl;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    color: "#4a5568",
    marginBottom: 12,
    fontWeight: "500",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    height: 42,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 4,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchSubtext: {
    fontSize: 14,
    color: "#718096",
    marginTop: 4,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  switchContainer: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  switchNote: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
    fontStyle: "italic",
  },
  statusContainer: {
    marginTop: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  statusLabel: {
    fontSize: 14,
    color: "#4a5568",
    fontWeight: "500",
  },
  statusValue: {
    fontSize: 14,
    color: "#2d3748",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOn: {
    backgroundColor: "#48bb78",
  },
  statusOff: {
    backgroundColor: "#9ca3af",
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  currentValue: {
    fontSize: 13,
    color: "#718096",
    marginBottom: 8,
    fontStyle: "italic",
  },
  modeSwitch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modeLabel: {
    fontSize: 12,
    color: "#4a5568",
    fontWeight: "500",
  },
  modeSwitchComponent: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});
