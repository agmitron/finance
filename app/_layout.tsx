import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { CardStyleInterpolators } from "@react-navigation/stack";
import { useStoreMap } from "effector-react";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
// import { HoldItem } from "react-native-hold-menu";

import TabOneScreen from "./(tabs)";
import TabTwoScreen from "./(tabs)/two";
import Accounts from "./accounts";
import CreateAccount from "./accounts.create";
import EditAccount from "./accounts.edit";
import Categories from "./categories";
import CreateCategory from "./categories.create";
import { Screens, screensWithTabs, Stack, useLinking } from "./navigation";
import CreateTransaction from "./transactions.create";
import { useTheme } from "../components/Themed";
import { Theme } from "../constants/theme";
import { accounts, categories } from "../store";
import { flattenCategories } from "../utils/categories";

import Button from "~/components/Button";
import Typography from "~/components/Typography";
import { incomeExpenseForm, transferForm } from "~/store/forms/transaction";


export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {/* {!loaded && <SplashScreen />} */}
      {loaded && <RootLayoutNav />}
    </>
  );
}

export const Tabs = () => {
  const theme = useTheme();
  const styles = withTheme(theme);

  const totalBalance = useStoreMap(accounts.$totalBalance, (b) => b.toFixed(2));
  const { navigate } = useNavigation();

  return (
    <View style={styles.navbar}>
      {/* TODO: Typings, styles */}
      <View style={{ rowGap: 10 }}>
        <Typography variant="text">Total balance</Typography>
        <Typography variant="title">{totalBalance}</Typography>
      </View>
      {/* TODO: reuse */}
      <Button
        variant="icon"
        onPress={() => navigate(Screens.TransactionsCreate as never)} // TODO: typings
      >
        <Image
          source={require("../assets/images/plus.png")}
          style={{
            // TODO
            width: 40,
            height: 45,
            margin: 0,
          }}
        />
      </Button>
    </View>
  );
};

function useTabs<T>(
  Component: () => React.ReactElement,
): (props: T) => React.ReactElement {
  const theme = useTheme();
  const styles = withTheme(theme);

  const Container = (_: T) => {
    const route = useRoute();
    return (
      <View style={styles.root}>
        <Component />
        {screensWithTabs.has(route.name) && <Tabs />}
      </View>
    );
  };

  return Container;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const styles = withTheme(theme);

  const categoriesScreens = useStoreMap(categories.$categories, (categories) =>
    Object.keys(flattenCategories(categories, "", {}, "/")),
  );

  const tabOne = useTabs(TabOneScreen);
  const tabTwo = useTabs(TabTwoScreen);

  const { navigate } = useNavigation();

  return (
    <View style={styles.root}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
          <Stack.Group>
            <Stack.Screen
              name={Screens.Home}
              options={{ headerTitle: "Finance" }}
              component={tabOne}
            />
            <Stack.Screen
              name={Screens.Settings}
              options={{ headerTitle: "Settings" }}
              component={tabTwo}
            />
          </Stack.Group>

          <Stack.Group
            screenOptions={{
              presentation: "modal",
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          >
            <Stack.Screen
              name={Screens.TransactionsCreate}
              options={{
                presentation: "modal",
                headerTitle: "Add a transaction",
              }}
              component={CreateTransaction}
            />

            <Stack.Screen
              name={Screens.Accounts}
              options={{
                headerTitle: "Choose an account",
              }}
              children={() => (
                <Accounts onChange={incomeExpenseForm.selectAccount} />
              )}
            />

            <Stack.Screen
              name={Screens.AccountsTransferFrom}
              options={{
                headerTitle: "Transfer from",
              }}
              children={() => <Accounts onChange={transferForm.selectFrom} />}
            />

            <Stack.Screen
              name={Screens.AccountsTransferTo}
              options={{
                headerTitle: "Transfer to",
              }}
              children={() => <Accounts onChange={transferForm.selectTo} />}
            />

            <Stack.Screen
              name={Screens.AccountsCreate}
              options={{
                headerTitle: "Add an account",
              }}
              component={CreateAccount}
            />

            <Stack.Screen name={Screens.AccountsEdit} component={EditAccount} />

            <Stack.Screen
              name={Screens.Categories}
              component={Categories}
              options={{
                headerTitle: "Categories",
                headerRight: () => (
                  <HoldItem
                    items={[
                      {
                        text: "Create a category",
                        isTitle: true,
                        onPress: () =>
                          navigate(Screens.CategoriesCreate as never),
                      },
                    ]}
                  >
                    <Pressable
                      // onPress={() =>
                      //   navigate(Screens.CategoriesCreate as never)
                      // }
                      style={{
                        backgroundColor: "transparent",
                        justifyContent: "space-around",
                        alignItems: "center",
                        flexDirection: "row",
                        width: 25,
                        height: 25,
                        borderColor: theme.colors.primary,
                        borderRadius: 25 / 2,
                        borderWidth: 1,
                        marginRight: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 3,
                          height: 3,
                          backgroundColor: theme.colors.primary,
                          borderRadius: 3 / 2,
                        }}
                      />
                      <View
                        style={{
                          width: 3,
                          height: 3,
                          backgroundColor: theme.colors.primary,
                          borderRadius: 3 / 2,
                        }}
                      />
                      <View
                        style={{
                          width: 3,
                          height: 3,
                          backgroundColor: theme.colors.primary,
                          borderRadius: 3 / 2,
                        }}
                      />
                    </Pressable>
                  </HoldItem>
                ),
                presentation: "modal",
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen
              name={Screens.CategoriesCreate}
              component={CreateCategory}
            />

            {categoriesScreens.map((cs) => (
              <Stack.Screen
                key={cs}
                name={`categories/${cs}`}
                component={Categories}
                options={{
                  headerTitle: "Categories",
                  presentation: "modal",
                  cardStyleInterpolator:
                    CardStyleInterpolators.forHorizontalIOS,
                }}
              />
            ))}
          </Stack.Group>
        </Stack.Navigator>
      </ThemeProvider>
    </View>
  );
}

const withTheme = (t: Theme) =>
  StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "100%",
      height: "100%",
    },
    navbar: {
      paddingVertical: 30,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: "rgb(217 217 220)",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      backgroundColor: "white",
    },
    navbar__button_bordered: {
      borderRightWidth: 1,
      borderRightColor: t.colors.surface,
    },
  });
