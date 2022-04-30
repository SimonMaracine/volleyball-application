import { StyleSheet, Text, View, SafeAreaView,
    TouchableOpacity, Modal, TextInput, StatusBar } from "react-native";
import { useState } from "react";

const TeamType = {
    Left: 1,
    Right: 2
};
Object.freeze(TeamType);

function winnerStyling(side, matchData) {
    if (side === TeamType.Left) {
        if (matchData.leftTeamScore === matchData.upTo) {
            return styles.yellowTeamNameText;
        } else {
            return {};
        }
    } else {
        if (matchData.rightTeamScore === matchData.upTo) {
            return styles.yellowTeamNameText;
        } else {
            return {};
        }
    }
}

function PrettyButton({style, text, onPress}) {
    return (
        <TouchableOpacity style={style} onPress={onPress}>
            <Text style={[styles.text, styles.buttonText]}>{text}</Text>
        </TouchableOpacity>
    );
}

function Team({side, onButtonPress, matchData}) {
    return (
        <View style={styles.teamView}>
            <View style={styles.teamNameView}>
                <Text style={[styles.text, styles.teamNameText, winnerStyling(side, matchData)]}>
                    {side === TeamType.Left ? "Left" : "Right"}
                </Text>
                <Text style={[styles.text, styles.teamNameText, winnerStyling(side, matchData)]}>Team</Text>
            </View>
            <Text style={[styles.text, styles.teamScoreText]}>
                {side === TeamType.Left ? matchData.leftTeamScore : matchData.rightTeamScore}
            </Text>
            <PrettyButton style={styles.scoreUpButton} text={"Score Up"} onPress={onButtonPress} />
        </View>
    );
}

function Configure({modalVisible, onEnter, upToInput, setUpToInput, onReset}) {
    return (
        <Modal animationType={"fade"} visible={modalVisible} onRequestClose={onEnter}>
            <View style={styles.modalView}>
                <PrettyButton style={styles.resetButton} text={"Reset Match"} onPress={onReset} />
                <Text style={styles.text}>Game lasts until:</Text>
                <TextInput
                    style={styles.input}
                    value={upToInput}
                    keyboardType="numeric"
                    placeholder="Something like 15, 20 or 25"
                    onChangeText={setUpToInput}
                />
                <PrettyButton style={styles.normalButton} text={"Enter"} onPress={onEnter} />
            </View>
        </Modal>
    );
}

function About({modalVisible, onOkay}) {
    return (
        <Modal animationType={"fade"} visible={modalVisible} onRequestClose={onOkay}>
            <View style={styles.modalView}>
                <View style={styles.aboutTextView}>
                    <Text style={styles.text}>Made by:</Text>
                    <Text style={styles.text}>Simon Mărăcine</Text>
                    <Text style={styles.text}>:D</Text>
                </View>
                <PrettyButton style={styles.normalButton} text={"Okay"} onPress={onOkay} />
            </View>
        </Modal>
    );
}

function VerticalSperator() {
    return (
        <View style={styles.separator} />
    );
}

export default function App() {
    const [matchData, setMatchData] = useState({
        leftTeamScore: 0,
        rightTeamScore: 0,
        turns: 0,
        upTo: 25,
        ended: false
    });
    const [history, setHistory] = useState([]);
    const [configureModalVisible, setConfigureModalVisible] = useState(false);
    const [upToInput, setUpToInput] = useState('');
    const [aboutModalVisible, setAboutModalVisible] = useState(false);

    const onLeftTeamButtonPress = () => {
        if (matchData.ended) {
            return;
        }

        const newScore = matchData.leftTeamScore + 1;

        if (newScore === matchData.upTo) {
            setMatchData({
                ...matchData,
                leftTeamScore: newScore,
                turns: matchData.turns + 1,
                ended: true
            });
        } else {
            setMatchData({
                ...matchData,
                leftTeamScore: newScore,
                turns: matchData.turns + 1
            });
        }

        setHistory([...history, TeamType.Left]);
    };

    const onRightTeamButtonPress = () => {
        if (matchData.ended) {
            return;
        }

        const newScore = matchData.rightTeamScore + 1;

        if (newScore === matchData.upTo) {
            setMatchData({
                ...matchData,
                rightTeamScore: newScore,
                turns: matchData.turns + 1,
                ended: true
            });
        } else {
            setMatchData({
                ...matchData,
                rightTeamScore: newScore,
                turns: matchData.turns + 1
            });
        }

        setHistory([...history, TeamType.Right]);
    };

    const onUndo = () => {
        if (history.length === 0) {
            return;
        }

        const teamType = history.pop();

        let newScore;
        let newEnded;

        switch (teamType) {
            case TeamType.Left:
                newScore = matchData.leftTeamScore - 1;
                break;
            case TeamType.Right:
                newScore = matchData.rightTeamScore - 1;
                break;
        }

        if (newScore < matchData.turns) {
            newEnded = false;
        } else {
            newEnded = true;
        }

        switch (teamType) {
            case TeamType.Left:
                setMatchData({
                    ...matchData,
                    leftTeamScore: newScore,
                    ended: newEnded,
                    turns: matchData.turns - 1
                });
                break;
            case TeamType.Right:
                setMatchData({
                    ...matchData,
                    rightTeamScore: newScore,
                    ended: newEnded,
                    turns: matchData.turns - 1
                });
                break;
        }
    };

    const onConfigure = () => {
        setConfigureModalVisible(!configureModalVisible);
    };

    const onTitlePress = () => {
        setAboutModalVisible(!aboutModalVisible);
    };

    const onConfigureEnter = () => {
        const input = parseInt(upToInput);

        if (!Number.isNaN(input) && input > 0 && input <= 100) {
            if (!matchData.ended && input > matchData.leftTeamScore
                    && input > matchData.rightTeamScore) {
                setMatchData({
                    ...matchData,
                    upTo: input
                });
            }
        }

        setConfigureModalVisible(!configureModalVisible);
    };

    const onReset = () => {
        setMatchData({
            ...matchData,
            leftTeamScore: 0,
            rightTeamScore: 0,
            turns: 0,
            ended: false
        });
        setHistory([]);
        setConfigureModalVisible(!configureModalVisible);
    };

    const onAboutOkay = () => {
        setAboutModalVisible(!aboutModalVisible);
    };

    return (
        <SafeAreaView style={styles.mainView}>
            <Configure
                modalVisible={configureModalVisible}
                onEnter={onConfigureEnter}
                upToInput={upToInput}
                setUpToInput={setUpToInput}
                onReset={onReset}
            />

            <About modalVisible={aboutModalVisible} onOkay={onAboutOkay} />

            <TouchableOpacity onPress={onTitlePress}>
                <Text style={[styles.text, styles.title]}>Volleyy :)</Text>
            </TouchableOpacity>

            <View style={styles.contentView}>
                <Team side={TeamType.Left} onButtonPress={onLeftTeamButtonPress} matchData={matchData} />
                <VerticalSperator />
                <Team side={TeamType.Right} onButtonPress={onRightTeamButtonPress} matchData={matchData} />
            </View>

            <View style={styles.bottomView}>
                <View style={styles.bottomContentView}>
                    <Text style={styles.text}>{"Turns: " + matchData.turns}</Text>
                    <PrettyButton style={styles.normalButton} text={"Undo"} onPress={onUndo} />
                </View>
                <View style={styles.bottomContentView}>
                    <Text style={styles.text}>{"Up to: " + matchData.upTo}</Text>
                    <PrettyButton style={styles.normalButton} text={"Configure"} onPress={onConfigure} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: "rgb(21, 21, 21)",
        justifyContent: "center",
        marginTop: StatusBar.currentHeight
    },
    contentView: {
        flex: 3,
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 30
    },
    teamView: {
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    teamNameView: {
        alignItems: "center"
    },
    bottomView: {
        flex: 1,
        justifyContent: "space-evenly"
    },
    bottomContentView: {
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "center"
    },
    modalView : {
        flex: 1,
        backgroundColor: "rgb(21, 21, 21)",
        justifyContent: "center",
        alignItems: "center"
    },
    aboutTextView: {
        alignItems: "center",
        marginBottom: 20
    },
    text: {
        color: "white",
        fontSize: 40
    },
    teamNameText: {
        fontSize: 45
    },
    yellowTeamNameText: {
        color: "yellow"
    },
    teamScoreText: {
        fontSize: 100,
        textAlign: "center"
    },
    buttonText: {
        fontSize: 30
    },
    title: {
        fontSize: 60,
        marginTop: 10,
        marginBottom: 60,
        textAlign: "center"
    },
    scoreUpButton: {
        width: "100%",
        backgroundColor: "rgb(15, 10, 220)",
        padding: 10,
        borderRadius: 15
    },
    resetButton: {
        backgroundColor: "rgb(75, 70, 255)",
        padding: 8,
        borderRadius: 15,
        marginBottom: 40
    },
    normalButton: {
        backgroundColor: "rgb(75, 70, 255)",
        padding: 8,
        borderRadius: 15
    },
    input: {
        fontSize: 25,
        color: "gray",
        backgroundColor: "white",
        padding: 5,
        marginTop: 10,
        marginBottom: 20
    },
    separator: {
        marginHorizontal: 10,
        borderRightColor: "rgb(215, 215, 215)",
        borderRightWidth: 4
    }
});
