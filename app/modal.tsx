import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import Typography from "../components/Typography";
import * as Haptics from "expo-haptics";
import TextField from "../components/TextField";
import { useTheme } from "../components/Themed";
import Button from "../components/Button";
import { Theme } from "../constants/theme";
import Select from "../components/Select";
import Card from "../components/Card";
import List from "~/components/List";
import {
  $amount,
  $type,
  addButtonPressed,
  amountChanged,
  typeChanged,
} from "~/store/form";
import { useStore } from "effector-react";
import { useRouter } from "expo-router";

type TransactionType = "income" | "expense" | "transfer";

interface Action {
  render: (key: string | number) => React.ReactElement;
}

// TODO: move to a separate component
export default function Modal() {
  const [isButtonHidden, setButtonHidden] = useState(false);
  const theme = useTheme();
  const styles = withTheme(theme);

  const type = useStore($type);
  const amount = useStore($amount);

  const router = useRouter();

  const onTypeChange = (newType: TransactionType) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }

    typeChanged(newType);
  };

  const onSubmit = () => {
    addButtonPressed();
    router.push("/");
  };

  const additionalActions: Action[] = [
    {
      render: (key) => (
        <List.Item key={key}>
          <Typography>Date</Typography>
        </List.Item>
      ),
    },
    {
      render: (key) => {
        return (
          <List.Item key={key} last>
            <TextField
              placeholder="Note"
              variant="plain"
              size="small"
              returnKeyLabel="done"
              returnKeyType="done"
            />
          </List.Item>
        );
      },
    },
  ];

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", () => setButtonHidden(true));
    Keyboard.addListener("keyboardWillHide", () => setButtonHidden(false));

    return () => {
      Keyboard.removeAllListeners("keyboardWillShow");
      Keyboard.removeAllListeners("keyboardWillHide");
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.main}>
            <Typography variant="title">Amount</Typography>
            <TextField
              placeholder="100$"
              size="large"
              decorations={{
                left: (
                  <View style={styles.operation}>
                    <Typography color={theme.colors.typography.secondary}>
                      {type === "income" ? "+" : "-"}
                    </Typography>
                  </View>
                ),
              }}
              onChangeText={amountChanged}
              value={amount}
              keyboardType="number-pad"
              returnKeyType="done"
              style={styles.input}
            />
            <View style={styles.types}>
              <Button
                variant={type === "transfer" ? "contained" : "outlined"}
                onPress={() => onTypeChange("transfer")}
                style={styles.type}
              >
                Transfer
              </Button>
              <Button
                variant={type === "income" ? "contained" : "outlined"}
                onPress={() => onTypeChange("income")}
                style={styles.type}
              >
                Income
              </Button>
              <Button
                variant={type === "expense" ? "contained" : "outlined"}
                onPress={() => onTypeChange("expense")}
                style={styles.type}
              >
                Expense
              </Button>
            </View>
            <Select
              title="Account"
              description="Tap to select"
              style={styles.select}
            />
            <Select
              title="Category"
              description="Tap to select"
              style={styles.select}
            />
          </View>
          <View style={styles.additional}>
            <Typography
              color={theme.colors.typography.primary}
              style={styles.additional__title}
            >
              Additional
            </Typography>
            <Card style={styles.card}>
              {additionalActions.map((a, i) => a.render(i))}
            </Card>
          </View>
        </ScrollView>
        <View
          style={{
            paddingHorizontal: 17,
            paddingBottom: 20,
            display: isButtonHidden ? "none" : "flex",
          }}
        >
          <Button size="large" onPress={onSubmit}>
            Add
          </Button>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const withTheme = (t: Theme) =>
  StyleSheet.create({
    root: {},
    operation: {
      marginLeft: 23,
    },
    input: {
      marginTop: 13,
    },
    types: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 18,
      columnGap: 4,
    },
    type: {
      flex: 1,
    },
    main: {
      backgroundColor: t.colors.background,
      paddingHorizontal: 17,
      paddingVertical: 28,
    },
    select: {
      marginTop: 38,
    },
    additional: {
      paddingHorizontal: 17,
      paddingVertical: 30,
      display: "flex",
      flexDirection: "column",
      rowGap: 15,
      flex: 1,
    },
    additional__title: {
      marginLeft: 15,
    },
    card: {
      paddingVertical: 0,
      paddingHorizontal: 15,
    },
  });
