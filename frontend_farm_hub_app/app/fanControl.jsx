import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { PYTHON_URL } from "../constants/appConst";

const fanControl = () => {
  //지정 온도를 저장할 state 변수
  const [temperature, setTemperature] = useState("");

  //지정 공기질을 저장할 state 변수
  const [airQuality, setAirQuality] = useState("");

  //팬 모드를 관리하는 state 변수 ('off' | 'ventilator' | 'fan')
  const [fanMode, setFanMode] = useState("OFF");

  //스위치 동작 중 로딩 상태
  const [switchLoading, setSwitchLoading] = useState(false);

  //현재 팬 상태 정보
  const [fanStatus, setFanStatus] = useState({
    isOn: false,
    mode: "atuo", // 'auto' | 'manual'
    lastUpdate: null,
  });

  //현재 팬 상태를 저장하는 함수

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
      setTemperature(response.data.temp.toString());
      setAirQuality(response.data.air.toString());
    } catch (error) {
      console.log("설정값 가져오기 실패:", error);
    }
  };

  //모드 스위치 전환 함수 (자동 ↔ 수동)
  const toggleModeSwitch = async (value) => {
    const newMode = value ? "manual" : "auto";

    try {
      console.log(`팬 모드 변경: ${newMode}`);

      // 자동 모드로 변경 시 수동 제어 스위치 끄기
      if (newMode === "auto") {
        setFanMode("OFF");
      }

      setFanStatus((prev) => ({
        ...prev,
        mode: newMode,
        lastUpdate: new Date().toLocaleTimeString(),
      }));

      // 실제 API 호출 (Python 서버에 해당 엔드포인트 추가 필요)
      const response = await axios.post(`${PYTHON_URL}/fanMode/${newMode}`);
      console.log("모드 변경 성공:", response.data);

      Alert.alert(
        "모드 변경",
        `팬이 ${newMode === "auto" ? "자동" : "수동"} 모드로 변경되었습니다.`,
        [{ text: "확인" }]
      );
    } catch (error) {
      console.log("모드 변경 에러:", error);
      Alert.alert("오류", "모드 변경에 실패했습니다.", [{ text: "확인" }]);
    }
  };

  //팬 모드 변경 함수 ('OFF' | 'AIR' | 'FAN')
  const changeFanMode = async (mode) => {
    if (switchLoading || fanStatus.mode === "auto") return; // 로딩 중이거나 자동 모드면 무시

    setSwitchLoading(true);

    try {
      console.log(`팬 모드 변경: ${mode}`);

      // 팬 제어 API 호출
      const response = await axios.post(`${PYTHON_URL}/fanControl/${mode}`);
      console.log("팬 제어 성공:", response.data);

      // 상태 업데이트
      setFanMode(mode);
      setFanStatus((prev) => ({
        ...prev,
        isOn: mode !== "OFF",
        mode: "manual",
        lastUpdate: new Date().toLocaleTimeString(),
      }));

      const modeText = mode === "OFF" ? "정지" : mode === "AIR" ? "환풍기 모드" : "선풍기 모드";
      Alert.alert(
        "팬 제어",
        `환기 팬이 ${modeText}로 변경되었습니다.`,
        [{ text: "확인" }]
      );
    } catch (error) {
      console.log("팬 제어 에러:", error);
      Alert.alert("오류", "팬 제어에 실패했습니다.", [{ text: "확인" }]);
    } finally {
      setSwitchLoading(false);
    }
  };

  //지정 온도 저장 버튼 클릭 시 실행함수
  const regTemp = async () => {
    // 입력값 검증
    if (!temperature || temperature.trim() === "") {
      Alert.alert("알림", "온도 값을 입력해주세요.");
      return;
    }

    const numValue = parseFloat(temperature);
    if (isNaN(numValue)) {
      Alert.alert("알림", "유효한 온도 값을 입력해주세요.");
      return;
    }

    try {
      console.log("온도 설정 요청:", numValue);
      const response = await axios.post(`${PYTHON_URL}/decideTemp/${numValue}`);

      Alert.alert("성공", "온도가 저장되었습니다.");

      // 설정 후 현재 값 다시 가져오기
      fetchCurrentSettings();
    } catch (error) {
      console.log("온도 설정 에러:", error);
      Alert.alert("오류", "온도 설정에 실패했습니다.");
    }
  };

  //지정 공기질 저장 버튼 클릭 시 실행함수
  const regAir = async () => {
    // 입력값 검증
    if (!airQuality || airQuality.trim() === "") {
      Alert.alert("알림", "공기질 값을 입력해주세요.");
      return;
    }

    const numValue = parseFloat(airQuality);
    if (isNaN(numValue) || numValue < 0) {
      Alert.alert("알림", "유효한 공기질 값을 입력해주세요. (0 이상의 숫자)");
      return;
    }

    try {
      console.log("공기질 설정 요청:", numValue);
      const response = await axios.post(`${PYTHON_URL}/decideAir/${numValue}`);

      Alert.alert("성공", "공기질이 저장되었습니다.");

      // 설정 후 현재 값 다시 가져오기
      fetchCurrentSettings();
    } catch (error) {
      console.log("공기질 설정 에러:", error);
      Alert.alert("오류", "공기질 설정에 실패했습니다.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>상세 설정</Text>

        {/* 현재 상태 표시 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>현재 팬 상태</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>전원:</Text>
              <View
                style={[
                  styles.statusBadge,
                  fanStatus.isOn ? styles.statusOn : styles.statusOff,
                ]}
              >
                <Text style={styles.statusText}>
                  {fanStatus.isOn ? "ON" : "OFF"}
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
                  value={fanStatus.mode === "manual"}
                  style={styles.modeSwitchComponent}
                />
                <Text style={styles.modeLabel}>수동</Text>
              </View>
            </View>
            {fanStatus.lastUpdate && (
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>마지막 업데이트:</Text>
                <Text style={styles.statusValue}>{fanStatus.lastUpdate}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>선풍기를 돌릴 온도를 입력해주세요.</Text>
          <Text style={styles.currentValue}>
            현재 설정: {currentSettings.temp}°C
          </Text>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="온도 (°C)"
                value={temperature}
                onChangeText={(text) => setTemperature(text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                title="저장"
                style={styles.button}
                onPress={() => regTemp()}
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>환풍기를 돌릴 공기질을 입력해주세요.</Text>
          <Text style={styles.currentValue}>
            현재 설정: {currentSettings.air} ppm
          </Text>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="공기질 (ppm)"
                value={airQuality}
                onChangeText={(text) => setAirQuality(text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                title="저장"
                style={styles.button}
                onPress={() => regAir()}
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>환기 팬 수동 제어</Text>
          <Text style={styles.switchSubtext}>
            {fanStatus.mode === "auto"
              ? "자동 모드에서는 수동 제어가 비활성화됩니다"
              : switchLoading
              ? "처리 중..."
              : fanMode === "OFF"
              ? "팬이 정지되어 있습니다"
              : fanMode === "AIR"
              ? "환풍기 모드로 작동 중입니다"
              : "선풍기 모드로 작동 중입니다"}
          </Text>
          <Text style={styles.switchNote}>
            {fanStatus.mode === "auto"
              ? "위의 모드 스위치를 수동으로 변경하면 제어할 수 있습니다."
              : "수동 모드에서 팬을 직접 제어할 수 있습니다."}
          </Text>

          {switchLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#be5050ff" />
            </View>
          ) : (
            <View style={styles.fanModeContainer}>
              <TouchableOpacity
                style={[
                  styles.fanModeButton,
                  fanMode === "AIR" && styles.fanModeButtonActive,
                  fanStatus.mode === "auto" && styles.fanModeButtonDisabled,
                ]}
                onPress={() => changeFanMode("AIR")}
                disabled={fanStatus.mode === "auto"}
              >
                <Text
                  style={[
                    styles.fanModeButtonText,
                    fanMode === "AIR" && styles.fanModeButtonTextActive,
                    fanStatus.mode === "auto" && styles.fanModeButtonTextDisabled,
                  ]}
                >
                  환풍기
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.fanModeButton,
                  fanMode === "OFF" && styles.fanModeButtonActive,
                  fanStatus.mode === "auto" && styles.fanModeButtonDisabled,
                ]}
                onPress={() => changeFanMode("OFF")}
                disabled={fanStatus.mode === "auto"}
              >
                <Text
                  style={[
                    styles.fanModeButtonText,
                    fanMode === "OFF" && styles.fanModeButtonTextActive,
                    fanStatus.mode === "auto" && styles.fanModeButtonTextDisabled,
                  ]}
                >
                  OFF
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.fanModeButton,
                  fanMode === "FAN" && styles.fanModeButtonActive,
                  fanStatus.mode === "auto" && styles.fanModeButtonDisabled,
                ]}
                onPress={() => changeFanMode("FAN")}
                disabled={fanStatus.mode === "auto"}
              >
                <Text
                  style={[
                    styles.fanModeButtonText,
                    fanMode === "FAN" && styles.fanModeButtonTextActive,
                    fanStatus.mode === "auto" && styles.fanModeButtonTextDisabled,
                  ]}
                >
                  선풍기
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default fanControl;

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
  loadingContainer: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  fanModeContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  fanModeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  fanModeButtonActive: {
    backgroundColor: "#be5050ff",
    borderColor: "#be5050ff",
  },
  fanModeButtonDisabled: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
    opacity: 0.5,
  },
  fanModeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a5568",
  },
  fanModeButtonTextActive: {
    color: "#ffffff",
  },
  fanModeButtonTextDisabled: {
    color: "#9ca3af",
  },
});
