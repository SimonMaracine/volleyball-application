import { StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import { useState } from "react";

const TeamType = {
    Left: 1,
    Right: 2
};
Object.freeze(TeamType);

function Team({side, onButtonPress, matchData}) {
    return (
        <View style={styles.teamView}>
            <View style={styles.teamNameView}>
                <Text style={[styles.text, styles.teamNameText]}>
                    {side === TeamType.Left ? "Left" : "Right"}
                </Text>
                <Text style={[styles.text, styles.teamNameText]}>Team</Text>
            </View>
            <Text style={[styles.text, styles.teamScoreText]}>
                {side === TeamType.Left ? matchData.leftTeamScore : matchData.rightTeamScore}
            </Text>
            <Button style={[styles.button]} title={"Up"} onPress={onButtonPress} />
        </View>
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
        upTo: 15,
        ended: false
    });

    const onLeftTeamButtonPress = () => {
        const newScore = matchData.leftTeamScore + 1;
        setMatchData({
            ...matchData,
            leftTeamScore: newScore
        });
    };

    const onRightTeamButtonPress = () => {
        const newScore = matchData.rightTeamScore + 1;
        setMatchData({
            ...matchData,
            rightTeamScore: newScore            
        });
    };

    return (
       <SafeAreaView style={styles.mainView}>
            <Text style={[styles.text, styles.title]}>Volleyy :)</Text>
            <View style={styles.contentView}>
                <Team side={TeamType.Left} onButtonPress={onLeftTeamButtonPress} matchData={matchData} />
                <VerticalSperator />
                <Team side={TeamType.Right} onButtonPress={onRightTeamButtonPress} matchData={matchData} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: "rgb(21, 21, 21)",
        justifyContent: "center"
    },
    contentView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    teamView: {
        justifyContent: "space-evenly",
        paddingHorizontal: 10
    },
    teamNameView: {
        alignItems: "center"
    },
    text: {
        color: "white",
        fontSize: 30
    },
    teamNameText: {
        fontSize: 40
    },
    teamScoreText: {
        fontSize: 65,
        textAlign: "center"
    },
    title: {
        fontSize: 55,
        marginTop: 10,
        marginBottom: 60,
        textAlign: "center"
    },
    button: {
        width: 100
    },
    separator: {
        marginHorizontal: 10,
        borderRightColor: "rgb(215, 215, 215)",
        borderRightWidth: 4
    }
});
