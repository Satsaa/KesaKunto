import * as ReactQuery from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
	Button,
	ButtonText,
	config as pollenConfig,
	TamaguiProvider,
	Theme,
} from "../../packages/pollen/src";
import {
	Animated,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import {
	createHttpHandler,
	createTrellisApp,
	createApiClient,
	subscribeToGroupUpdates,
	type GroupEntry,
	type GroupUpdate,
} from "trellis-api-core";
import { groups, definitions } from "./api/definitions";
import { endpoints, resetTestState, type Api } from "./api/backend";

const queryClient = new QueryClient();
resetTestState();
const handler = createHttpHandler(
	createTrellisApp({
		endpoints,
	}),
	{ basePath: "/api" },
);

const inMemoryFetch: typeof fetch = async (input, init) => {
	const request = input instanceof Request ? input : new Request(String(input), init);
	return handler(request);
};

const api = createApiClient<Api>({
	baseUrl: "http://trellis.local/api",
	headers: () => ({}),
	definitions,
	fetch: inMemoryFetch,
	reactQuery: ReactQuery,
});

function Section(props: { title: string; children: ReactNode }) {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>{props.title}</Text>
			{props.children}
		</View>
	);
}

function ActionButton(props: { label: string; onPress: () => void }) {
	return (
		<Button onPress={props.onPress}>
			<ButtonText>{props.label}</ButtonText>
		</Button>
	);
}

function useGroupUpdates(watchedGroups: readonly GroupEntry[]) {
	const [state, setState] = useState({
		updatedAt: 0,
		count: 0,
		lastGroups: [] as readonly GroupEntry[],
	});
	const watchedKeys = useMemo(
		() => new Set(watchedGroups.map((group) => group.key)),
		[watchedGroups],
	);

	useEffect(() => {
		return subscribeToGroupUpdates((update: GroupUpdate) => {
			if (!update.groups.some((group) => watchedKeys.has(group.key))) {
				return;
			}

			setState((current) => ({
				updatedAt: update.updatedAt,
				count: current.count + 1,
				lastGroups: update.groups,
			}));
		});
	}, [watchedKeys]);

	return state;
}

function ValueText(props: { groups: readonly GroupEntry[]; text: string }) {
	const update = useGroupUpdates(props.groups);
	const scale = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		if (update.updatedAt === 0) {
			return;
		}

		scale.setValue(1.06);
		Animated.spring(scale, {
			toValue: 1,
			useNativeDriver: true,
			friction: 7,
			tension: 120,
		}).start();
	}, [scale, update.updatedAt]);

	return (
		<Animated.View style={{ transform: [{ scale }] }}>
			<Text style={styles.value}>{props.text}</Text>
		</Animated.View>
	);
}

function SharedValueCard() {
	const value = api.sharedValue.get.useQuery({});
	const mutate = api.sharedValue.increment.useMutation();

	return (
		<View style={styles.card}>
			<Text style={styles.label}>shared value</Text>
			<ValueText groups={[groups.sharedValue]} text={String(value.data ?? "...")} />
			<ActionButton label="Increment" onPress={() => mutate.mutate({ delta: 1 })} />
		</View>
	);
}

function ValuesList() {
	const list = api.values.list.useQuery({});
	const reset = api.values.reset.useMutation();

	return (
		<Section title="Values collection">
			<Text style={styles.label}>values</Text>
			<ValueText
				groups={[groups.values]}
				text={
					list.data
						? list.data
								.map(
									(entry: { id: number; value: number; child: number }) =>
										`[${entry.id}] ${entry.value} / child ${entry.child}`,
								)
								.join("  ")
						: "..."
				}
			/>
			<ActionButton label="Reset all values" onPress={() => reset.mutate({})} />
		</Section>
	);
}

function ValueCard(props: { id: 0 | 1 }) {
	const valueGroup = groups.values(props.id);
	const childGroup = groups.values(props.id).child;
	const value = api.values.getById.useQuery({ id: props.id });
	const child = api.values.getChildById.useQuery({ id: props.id });
	const mutate = api.values.incrementById.useMutation();
	const mutateChild = api.values.incrementChildById.useMutation();

	return (
		<View style={styles.card}>
			<Text style={styles.label}>id {props.id}</Text>
			<ValueText
				groups={[valueGroup]}
				text={`value: ${String(value.data?.value ?? "...")} | child: ${String(value.data?.child ?? "...")}`}
			/>
			<ValueText groups={[childGroup]} text={`value.child: ${String(child.data ?? "...")}`} />
			<View style={styles.row}>
				<ActionButton
					label={`Increment value ${props.id}`}
					onPress={() => mutate.mutate({ id: props.id, delta: 1 })}
				/>
				<ActionButton
					label={`Increment child ${props.id}`}
					onPress={() => mutateChild.mutate({ id: props.id, delta: 1 })}
				/>
			</View>
		</View>
	);
}

function Showcase() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.container}>
				<Section title="Shared value">
					<View style={styles.row}>
						<SharedValueCard />
						<SharedValueCard />
					</View>
				</Section>
				<ValuesList />
				<Section title="Values entries">
					<View style={styles.column}>
						<ValueCard id={0} />
						<ValueCard id={1} />
					</View>
				</Section>
			</ScrollView>
		</SafeAreaView>
	);
}

export default function App() {
	return (
		<TamaguiProvider config={pollenConfig} defaultTheme="light">
			<Theme name="light">
				<QueryClientProvider client={queryClient}>
					<Showcase />
					<StatusBar style="auto" />
				</QueryClientProvider>
			</Theme>
		</TamaguiProvider>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#f4f4ef",
	},
	container: {
		padding: 20,
		gap: 16,
	},
	section: {
		gap: 12,
		padding: 16,
		borderRadius: 16,
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#d7d4cc",
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#171717",
	},
	row: {
		flexDirection: "row",
		gap: 12,
		flexWrap: "wrap",
	},
	column: {
		gap: 12,
	},
	card: {
		flexGrow: 1,
		minWidth: 260,
		gap: 10,
		padding: 16,
		borderRadius: 14,
		backgroundColor: "#faf8f2",
		borderWidth: 1,
		borderColor: "#d7d4cc",
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#525252",
	},
	value: {
		fontSize: 24,
		fontWeight: "700",
		color: "#171717",
	},
});
