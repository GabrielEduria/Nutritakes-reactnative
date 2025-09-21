
 export default function Dashboard() {

//       useEffect(() => {
//         const fetchMeals = async () => {
//           if (!auth.currentUser) return;
//           const firebaseUid = auth.currentUser.uid;

//           try {
//             const mealsData = await getMeals(firebaseUid); 
//             setMeals(mealsData);
//             calculateStats(mealsData);
//           } catch (err) {
//             console.error("Error fetching meals:", err);
//           } finally {
//             setLoading(false);
//           }
//         };

//     fetchMeals();
//   }, []);

//       const calculateStats = (mealsData: Meal[]) => {
//         const today = new Date();

//         const caloriesToday = mealsData
//           .filter((meal) => {
//             if (!meal.timestamp) return false; 

//             const mealDate =
//               typeof (meal.timestamp as any)?.toDate === "function"
//                 ? (meal.timestamp as any).toDate() 
//                 : new Date(meal.timestamp); 

//             return (
//               mealDate.getDate() === today.getDate() &&
//               mealDate.getMonth() === today.getMonth() &&
//               mealDate.getFullYear() === today.getFullYear()
//             );
//           })
//           .reduce((sum, meal) => sum + (meal.calories || 0), 0);

//         const uniqueDishes = new Set(mealsData.map((meal) => meal.name));

//         setStats({
//           mealsLogged: mealsData.length,
//           caloriesToday,
//           dishesRecognized: uniqueDishes.size,
//         });
//       };

//   if (loading)
//     return (
//       <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
//         <ActivityIndicator size="large" style={{ marginTop: 50 }} />
//       </LinearGradient>
//     );

//   return (
//     <LinearGradient colors={["#FFFDD0", "#FFD580", "#FFB347"]} style={styles.background}>
//       <ScrollView contentContainerStyle={styles.container}>

//         <Text style={styles.sectionTitle}>Your Stats</Text>
//         <View style={styles.statsContainer}>
//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>{stats.mealsLogged}</Text>
//             <Text style={styles.statLabel}>Meals Logged</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>{stats.caloriesToday}</Text>
//             <Text style={styles.statLabel}>Calories Today</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={styles.statValue}>{stats.dishesRecognized}</Text>
//             <Text style={styles.statLabel}>Dishes Recognized</Text>
//           </View>
//         </View>


//         <Text style={styles.sectionTitle}>Recent Meals</Text>
//         <View style={styles.mealsContainer}>
//           {meals.length > 0 ? (
//             meals.map((meal, index) => <MacroCard key={index} meal={meal} />)
//           ) : (
//             <Text style={{ textAlign: "center", color: "#555" }}>
//               No meals logged yet.
//             </Text>
//           )}
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   background: { flex: 1 },
//   container: { paddingBottom: 30, paddingTop: 20, alignItems: "center" },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginVertical: 12,
//     alignSelf: "flex-start",
//     marginLeft: 20,
//   },
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "90%",
//     marginBottom: 20,
//   },
//   statCard: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     flex: 1,
//     marginHorizontal: 5,
//     alignItems: "center",
//     elevation: 2,
//   },
//   statValue: { fontSize: 18, fontWeight: "700" },
//   statLabel: { fontSize: 14, color: "#555", textAlign: "center", marginTop: 4 },
//   mealsContainer: { width: "90%" },
 };
