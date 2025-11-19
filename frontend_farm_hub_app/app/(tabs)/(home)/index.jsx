import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  ScrollView,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import dayjs from "dayjs";
import { SERVER_URL } from '../../../constants/appConst';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/app/contexts/AuthContext';

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const router = useRouter();
  const { logout } = useAuth();

  // 관리자 로그아웃 함수 
  const handleLogout = async () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: async () => {
          try {
            await logout(); 
            router.replace('/(tabs)/product'); 
          } catch (error) {
            console.error('로그아웃 에러:', error);
            Alert.alert('오류', '로그아웃에 실패했습니다.');
          }
        },
      },
    ]);
  };


  // 축사 온도 데이터를 받을 state 변수
  const [temperatureData, setTemperatureData] = useState([]);
  
  // 축사 습도 데이터를 받을 state 변수
  const [humidityData, setHumidityData] = useState([]);

  // 축사 조도 데이터를 받을 state 변수
  const [illuminanceData, setIlluminanceData] = useState([]);

  // 축사 공기질 데이터를 받을 state 변수
  const [airQualityData, setAirQualityData] = useState([]);

  const days = [];
  for (let i = 0; i < 28; i++) {
    days.push(i + 1);
  }

  // select 된 값에 따라 표시되는 값이 달라짐
  const [dateRange, setDateRange] = useState("7");
  const [humidityDateRange, setHumidityDateRange] = useState("7");
  const [illuminanceDateRange, setIlluminanceDateRange] = useState("7");
  const [airQualityDateRange, setAirQualityDateRange] = useState("7");

  //온도 데이터 실시간으로 가져오기
  useFocusEffect(
    useCallback(() => {
      console.log('🟢 useFocusEffect 실행됨!');
      const fetchTemp = () => {
        console.log('🌡️ fetchTemp 함수 호출됨!');
        const rangeArray = days.slice(0, parseInt(dateRange));
        axios
        .get(`${SERVER_URL}/farms/temperature`, { params: { each: rangeArray } })
        .then((res) => {
          console.log('온도 데이터 : ', res.data);
          setTemperatureData(res.data);
        })
        .catch((e) => {
          console.log("온도 에러:", e);
        });
      };

      fetchTemp(); //즉시 실행

      const tempTimer = setInterval(fetchTemp, 10000) //10초마다 반복
      console.log('⏱️ 타이머 설정 완료');

      //다른 페이지로 이동하면 자동 중단
      return () => {
        console.log('🔴 cleanup 실행 - 타이머 중단');
        clearInterval(tempTimer);
      }

    }, [dateRange])
  );

  // 습도 데이터 실시간으로 가져오기
  useFocusEffect(
    useCallback(() => {
      console.log('🟢 useFocusEffect 실행됨!');
      const fetchHum = () => {
        console.log('fetchHum 함수 호출됨!');
        const rangeArray = days.slice(0, parseInt(humidityDateRange));
        axios
        .get(`${SERVER_URL}/farms/humidity`, { params: { each: rangeArray } })
        .then((res) => {
          console.log('습도 데이터 : ', res.data);
          setHumidityData(res.data);
        })
        .catch((e) => {
          console.log("습도 에러:", e);
        });
      };

      fetchHum(); //즉시 실행

      const humTimer = setInterval(fetchHum, 10000) //10초마다 반복
      console.log('⏱️ 타이머 설정 완료');

      //다른 페이지로 이동하면 자동 중단
      return () => {
        console.log('🔴 cleanup 실행 - 타이머 중단');
        clearInterval(humTimer);
      }
    }, [humidityDateRange])
  );

  // 조도 데이터 실시간으로 가져오기
  useFocusEffect(
    useCallback(() => {
      console.log('🟢 useFocusEffect 실행됨!');
      const fetchIll = () => {
        console.log('fetchIll 함수 호출됨!');
        const rangeArray = days.slice(0, parseInt(illuminanceDateRange));
        axios
        .get(`${SERVER_URL}/farms/illuminance`, { params: { each: rangeArray } })
        .then((res) => {
          console.log('조도 데이터 : ', res.data);
          setIlluminanceData(res.data);
        })
        .catch((e) => {
          console.log("조도 에러:", e);
        });
      };

      fetchIll(); //즉시 실행

      const illTimer = setInterval(fetchIll, 10000) //10초마다 반복
      console.log('⏱️ 타이머 설정 완료');

      //다른 페이지로 이동하면 자동 중단
      return () => {
        console.log('🔴 cleanup 실행 - 타이머 중단');
        clearInterval(illTimer);
      }
    }, [illuminanceDateRange])
  );

  // 공기질 데이터 실시간으로 가져오기
  useFocusEffect(
    useCallback(() => {
      console.log('🟢 useFocusEffect 실행됨!');
      const fetchAir = () => {
        console.log('fetchAir 함수 호출됨!');
        const rangeArray = days.slice(0, parseInt(airQualityDateRange));
        axios
        .get(`${SERVER_URL}/farms/air-quality`, { params: { each: rangeArray } })
        .then((res) => {
          console.log("공기질 데이터:", res.data);
          setAirQualityData(res.data);
        })
        .catch((e) => {
          console.log("공기질 에러:", e);
        });
      };

      fetchAir(); //즉시 실행

      const airTimer = setInterval(fetchAir, 10000) //10초마다 반복
      console.log('⏱️ 타이머 설정 완료');

      //다른 페이지로 이동하면 자동 중단
      return () => {
        console.log('🔴 cleanup 실행 - 타이머 중단');
        clearInterval(airTimer);
      }
    }, [airQualityDateRange])
  );
  
  // 온도 차트 데이터 포맷팅
  const maxTempData = temperatureData.length > 0 ? temperatureData.map((e, index) => ({
    value: e.maxTemp || null,
    label: dayjs(e.createDate).format("MM-DD"),
    dataPointText: e.maxTemp ? e.maxTemp.toFixed(1) : '',
  })) : [];

  const avgTempData = temperatureData.length > 0 ? temperatureData.map((e) => ({
    value: e.avgTemp || null,
  })) : [];

  const minTempData = temperatureData.length > 0 ? temperatureData.map((e) => ({
    value: e.minTemp || null,
  })) : [];

  // 습도 차트 데이터 포맷팅
  const maxHumData = humidityData.length > 0 ? humidityData.map((e, index) => ({
    value: e.maxHum || null,
    label: dayjs(e.createDate).format("MM-DD"),
    dataPointText: e.maxHum ? e.maxHum.toFixed(1) : '',
  })) : [];

  const avgHumData = humidityData.length > 0 ? humidityData.map((e) => ({
    value: e.avgHum || null,
  })) : [];

  const minHumData = humidityData.length > 0 ? humidityData.map((e) => ({
    value: e.minHum || null,
  })) : [];

  // 조도 차트 데이터 포맷팅
  const maxIllData = illuminanceData.length > 0 ? illuminanceData.map((e, index) => ({
    value: e.maxIll || null,
    label: dayjs(e.createDate).format("MM-DD"),
    dataPointText: e.maxIll ? e.maxIll.toFixed(1) : '',
  })) : [];

  const avgIllData = illuminanceData.length > 0 ? illuminanceData.map((e) => ({
    value: e.avgIll || null,
  })) : [];

  const minIllData = illuminanceData.length > 0 ? illuminanceData.map((e) => ({
    value: e.minIll || null,
  })) : [];

  // 공기질 차트 데이터 포맷팅
  const maxAirData = airQualityData.length > 0 ? airQualityData.map((e, index) => ({
    value: e.maxAir || null,
    label: dayjs(e.createDate).format("MM-DD"),
    dataPointText: e.maxAir ? e.maxAir.toFixed(1) : '',
  })) : [];

  const avgAirData = airQualityData.length > 0 ? airQualityData.map((e) => ({
    value: e.avgAir || null,
  })) : [];

  const minAirData = airQualityData.length > 0 ? airQualityData.map((e) => ({
    value: e.minAir || null,
  })) : [];


  // 온도 통계 계산
  const calculateStats = () => {
    if (temperatureData.length === 0) {
      return {maxValue: "0.0", avgValue: "0.0", minValue: "0.0",};
    }

    // null이 아닌 데이터만 필터링 (0 포함)
    const validMaxData = temperatureData.filter((e) => e.maxTemp != null).map((e) => e.maxTemp);
    const validAvgData = temperatureData.filter((e) => e.avgTemp != null).map((e) => e.avgTemp);
    const validMinData = temperatureData.filter((e) => e.minTemp != null).map((e) => e.minTemp);

    const maxValue = validMaxData.length > 0 ? Math.max(...validMaxData).toFixed(1) : "0.0";
    const avgValue = validAvgData.length > 0
        ? (validAvgData.reduce((acc, e) => acc + e, 0) / validAvgData.length).toFixed(1)
        : "0.0";
    const minValue = validMinData.length > 0 ? Math.min(...validMinData).toFixed(1) : "0.0";

    return { maxValue, avgValue, minValue };
  };

  // 습도 통계 계산
  const calculateHumStats = () => {
    if (humidityData.length === 0) {
      return { maxValue: "0.0", avgValue: "0.0", minValue: "0.0" };
    }

    const validMaxData = humidityData.filter((e) => e.maxHum != null).map((e) => e.maxHum);
    const validAvgData = humidityData.filter((e) => e.avgHum != null).map((e) => e.avgHum);
    const validMinData = humidityData.filter((e) => e.minHum != null).map((e) => e.minHum);

    const maxValue = validMaxData.length > 0 ? Math.max(...validMaxData).toFixed(1) : "0.0";
    const avgValue = validAvgData.length > 0
      ? (validAvgData.reduce((acc, e) => acc + e, 0) / validAvgData.length).toFixed(1)
      : "0.0";
    const minValue = validMinData.length > 0 ? Math.min(...validMinData).toFixed(1) : "0.0";

    return { maxValue, avgValue, minValue };
  };

  // 조도 통계 계산
  const calculateIllStats = () => {
    if (illuminanceData.length === 0) {
      return { maxValue: "0.0", avgValue: "0.0", minValue: "0.0" };
    }

    const validMaxData = illuminanceData.filter((e) => e.maxIll != null).map((e) => e.maxIll);
    const validAvgData = illuminanceData.filter((e) => e.avgIll != null).map((e) => e.avgIll);
    const validMinData = illuminanceData.filter((e) => e.minIll != null).map((e) => e.minIll);

    const maxValue = validMaxData.length > 0 ? Math.max(...validMaxData).toFixed(1) : "0.0";
    const avgValue = validAvgData.length > 0
      ? Math.round(validAvgData.reduce((acc, e) => acc + e, 0) / validAvgData.length).toFixed(1)
      : "0.0";
    const minValue = validMinData.length > 0 ? Math.min(...validMinData).toFixed(1) : "0.0";

    return { maxValue, avgValue, minValue };
  };

  // 공기질 통계 계산
  const calculateAirStats = () => {
    if (airQualityData.length === 0) {
      return { maxValue: "0.0", avgValue: "0.0", minValue: "0.0" };
    }

    const validMaxData = airQualityData.filter((e) => e.maxAir != null).map((e) => e.maxAir);
    const validAvgData = airQualityData.filter((e) => e.avgAir != null).map((e) => e.avgAir);
    const validMinData = airQualityData.filter((e) => e.minAir != null).map((e) => e.minAir);

    const maxValue = validMaxData.length > 0 ? Math.max(...validMaxData).toFixed(1) : "0.0";
    const avgValue = validAvgData.length > 0
      ? (validAvgData.reduce((acc, e) => acc + e, 0) / validAvgData.length).toFixed(1)
      : "0.0";
    const minValue = validMinData.length > 0 ? Math.min(...validMinData).toFixed(1) : "0.0";

    return { maxValue, avgValue, minValue };
  };

  const stats = calculateStats();
  const humStats = calculateHumStats();
  const illStats = calculateIllStats();
  const airStats = calculateAirStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.accountSection}>
        <Text>관리자님, 안녕하세요.{' '}{' '}</Text>       
        <Pressable onPress={handleLogout}>
          <Text style={{ textDecorationLine: 'underline' }}>로그아웃</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>온도</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={dateRange}
                onValueChange={(itemValue) => setDateRange(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="1주전" value="7" />
                <Picker.Item label="2주전" value="14" />
                <Picker.Item label="3주전" value="21" />
                <Picker.Item label="4주전" value="28" />
              </Picker>
            </View>
          </View>

          <View style={styles.statsGrid}>
              <View style={[styles.statCard, styles.statCardMax]}>
                <Text style={styles.statLabel}>최고 온도</Text>
                <Text style={[styles.statValue, styles.statValueMax]}>
                  {temperatureData.length > 0 ? `${stats.maxValue} °C` : "- °C"}
                </Text>
              </View>

              <View style={[styles.statCard, styles.statCardAvg]}>
                <Text style={styles.statLabel}>평균 온도</Text>
                <Text style={[styles.statValue, styles.statValueAvg]}>
                  {temperatureData.length > 0 ? `${stats.avgValue} °C` : "- °C"}
                </Text>
              </View>

              <View style={[styles.statCard, styles.statCardMin]}>
                <Text style={styles.statLabel}>최저 온도</Text>
                <Text style={[styles.statValue, styles.statValueMin]}>
                  {temperatureData.length > 0 ? `${stats.minValue} °C` : "- °C"}
                </Text>
              </View>
            </View>

          {temperatureData.length > 0 ? (
            <View style={styles.chartContainer}>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#FF6384" }]} />
                  <Text style={styles.legendText}>최고</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#36A2EB" }]} />
                  <Text style={styles.legendText}>평균</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#EB35E2" }]} />
                  <Text style={styles.legendText}>최저</Text>
                </View>
              </View>

              <LineChart
                data={maxTempData}
                data2={avgTempData}
                data3={minTempData}
                width={width - 110}
                height={250}
                color1="#FF6384"
                color2="#36A2EB"
                color3="#EB35E2"
                thickness={2}
                curved
                areaChart
                startFillColor1="#FF6384"
                startFillColor2="#36A2EB"
                startFillColor3="#EB35E2"
                endFillColor1="#FF638400"
                endFillColor2="#36A2EB00"
                endFillColor3="#EB35E200"
                startOpacity={0.4}
                endOpacity={0.1}
              />
            </View>
          ) : (
            <Text style={styles.loadingText}>데이터 로딩 중...</Text>
          )}
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>습도</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={humidityDateRange}
                onValueChange={(itemValue) => setHumidityDateRange(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="1주전" value="7" />
                <Picker.Item label="2주전" value="14" />
                <Picker.Item label="3주전" value="21" />
                <Picker.Item label="4주전" value="28" />
              </Picker>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardMax]}>
              <Text style={styles.statLabel}>최고 습도</Text>
              <Text style={[styles.statValue, styles.statValueMax]}>
                {humidityData.length > 0 ? `${humStats.maxValue} %` : "- %"}
              </Text>
            </View>

            <View style={[styles.statCard, styles.statCardAvg]}>
              <Text style={styles.statLabel}>평균 습도</Text>
              <Text style={[styles.statValue, styles.statValueAvg]}>
                {humidityData.length > 0 ? `${humStats.avgValue} %` : "- %"}
              </Text>
            </View>

            <View style={[styles.statCard, styles.statCardMin]}>
              <Text style={styles.statLabel}>최저 습도</Text>
              <Text style={[styles.statValue, styles.statValueMin]}>
                {humidityData.length > 0 ? `${humStats.minValue} %` : "- %"}
              </Text>
            </View>
          </View>

          {humidityData.length > 0 ? (
            <View style={styles.chartContainer}>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#FF6384" }]} />
                  <Text style={styles.legendText}>최고</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#36A2EB" }]} />
                  <Text style={styles.legendText}>평균</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#EB35E2" }]} />
                  <Text style={styles.legendText}>최저</Text>
                </View>
              </View>

              <LineChart
                data={maxHumData}
                data2={avgHumData}
                data3={minHumData}
                width={width - 110}
                height={250}
                color1="#FF6384"
                color2="#36A2EB"
                color3="#EB35E2"
                thickness={2}
                curved
                areaChart
                startFillColor1="#FF6384"
                startFillColor2="#36A2EB"
                startFillColor3="#EB35E2"
                endFillColor1="#FF638400"
                endFillColor2="#36A2EB00"
                endFillColor3="#EB35E200"
                startOpacity={0.4}
                endOpacity={0.1}
              />
            </View>
          ) : (
            <Text style={styles.loadingText}>데이터 로딩 중...</Text>
          )}

        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>조도</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={illuminanceDateRange}
                onValueChange={(itemValue) => setIlluminanceDateRange(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="1주전" value="7" />
                <Picker.Item label="2주전" value="14" />
                <Picker.Item label="3주전" value="21" />
                <Picker.Item label="4주전" value="28" />
              </Picker>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardMax]}>
              <Text style={styles.statLabel}>최고 조도</Text>
              <Text style={[styles.statValue, styles.statValueMax]}>
                {illuminanceData.length > 0 ? `${illStats.maxValue} lux` : "- lux"}
              </Text>
            </View>

            <View style={[styles.statCard, styles.statCardAvg]}>
              <Text style={styles.statLabel}>평균 조도</Text>
              <Text style={[styles.statValue, styles.statValueAvg]}>
                {illuminanceData.length > 0 ? `${illStats.avgValue} lux` : "- lux"}
              </Text>
            </View>

            <View style={[styles.statCard, styles.statCardMin]}>
              <Text style={styles.statLabel}>최저 조도</Text>
              <Text style={[styles.statValue, styles.statValueMin]}>
                {illuminanceData.length > 0 ? `${illStats.minValue} lux` : "- lux"}
              </Text>
            </View>
          </View>

          {illuminanceData.length > 0 ? (
            <View style={styles.chartContainer}>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#FF6384" }]} />
                  <Text style={styles.legendText}>최고</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#36A2EB" }]} />
                  <Text style={styles.legendText}>평균</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#EB35E2" }]} />
                  <Text style={styles.legendText}>최저</Text>
                </View>
              </View>

              <LineChart
                data={maxIllData}
                data2={avgIllData}
                data3={minIllData}
                width={width - 110}
                height={250}
                color1="#FF6384"
                color2="#36A2EB"
                color3="#EB35E2"
                thickness={2}
                curved
                areaChart
                startFillColor1="#FF6384"
                startFillColor2="#36A2EB"
                startFillColor3="#EB35E2"
                endFillColor1="#FF638400"
                endFillColor2="#36A2EB00"
                endFillColor3="#EB35E200"
                startOpacity={0.4}
                endOpacity={0.1}
              />
            </View>
          ) : (
            <Text style={styles.loadingText}>데이터 로딩 중...</Text>
          )}
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>공기질</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={airQualityDateRange}
                onValueChange={(itemValue) => setAirQualityDateRange(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="1주전" value="7" />
                <Picker.Item label="2주전" value="14" />
                <Picker.Item label="3주전" value="21" />
                <Picker.Item label="4주전" value="28" />
              </Picker>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardMax]}>
              <Text style={styles.statLabel}>최고 공기질</Text>
              <Text style={[styles.statValue, styles.statValueMax]}>
                {airQualityData.length > 0 ? `${airStats.maxValue} ppm` : "- ppm"}
              </Text>
            </View>

            <View style={[styles.statCard, styles.statCardAvg]}>
              <Text style={styles.statLabel}>평균 공기질</Text>
              <Text style={[styles.statValue, styles.statValueAvg]}>
                {airQualityData.length > 0 ? `${airStats.avgValue} ppm` : "- ppm"}
              </Text>
            </View>

            <View style={[styles.statCard, styles.statCardMin]}>
              <Text style={styles.statLabel}>최저 공기질</Text>
              <Text style={[styles.statValue, styles.statValueMin]}>
                {airQualityData.length > 0 ? `${airStats.minValue} ppm` : "- ppm"}
              </Text>
            </View>
          </View>

          {airQualityData.length > 0 ? (
            <View style={styles.chartContainer}>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#FF6384" }]} />
                  <Text style={styles.legendText}>최고</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#36A2EB" }]} />
                  <Text style={styles.legendText}>평균</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#EB35E2" }]} />
                  <Text style={styles.legendText}>최저</Text>
                </View>
              </View>

              <LineChart
                data={maxAirData}
                data2={avgAirData}
                data3={minAirData}
                width={width - 110}
                height={250}
                color1="#FF6384"
                color2="#36A2EB"
                color3="#EB35E2"
                thickness={2}
                curved
                areaChart
                startFillColor1="#FF6384"
                startFillColor2="#36A2EB"
                startFillColor3="#EB35E2"
                endFillColor1="#FF638400"
                endFillColor2="#36A2EB00"
                endFillColor3="#EB35E200"
                startOpacity={0.4}
                endOpacity={0.1}
              />
            </View>
          ) : (
            <Text style={styles.loadingText}>데이터 로딩 중...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  pickerContainer: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 4,
  },
  picker: {
    height: 55,
    width: 120,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  statCardMax: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statCardAvg: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  statCardMin: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  statValueMax: {
    color: '#DC2626',
  },
  statValueAvg: {
    color: '#0284C7',
  },
  statValueMin: {
    color: '#9333EA',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FAFBFC',
    borderRadius: 12,
    marginTop: 12,
    overflow: 'hidden',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  loadingText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    paddingVertical: 40,
    fontStyle: 'italic',
  },
  accountSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 25,
    marginBottom: 10
  },
})