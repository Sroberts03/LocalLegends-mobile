import Game, { GameStatus, SkillLevel, GenderPreference, AccessType } from "@/src/models/Game";
import Profile, { ProfileStatus } from "@/src/models/Profile";
import Location from "@/src/models/Location";
import Sport, { SportCategory, SportStatus } from "@/src/models/Sport";

class MockDataStore {

    currentUserId = "user1";
    //userId -> user data
    Users = new Map<string, Profile>();
    //gameId -> game data
    Games = new Map<number, Game>();
    //userId -> list of gameIds they are participating in
    userGames = new Map<string, number[]>();
    //locationId -> location data
    Locations = new Map<number, Location>();
    //sportId -> sport data
    Sports = new Map<number, Sport>();
    //userId -> list of sportIds they are interested in
    userSports = new Map<string, number[]>();

    constructor() {
        // Initialize mock user data
        const user1 = new Profile("user1", "Alice", ProfileStatus.GoodStanding, "https://i.pravatar.cc/300?u=alice", 2020, "Love playing sports and meeting new people!", 95);
        const user2 = new Profile("user2", "Bob", ProfileStatus.GoodStanding, "https://i.pravatar.cc/300?u=bob", 2021, "I love playing soccer!", 85);
        const user3 = new Profile("user3", "Charlie", ProfileStatus.Banned, "https://i.pravatar.cc/300?u=charlie", 2019, "I'm a bit rusty, but I'm up for a challenge!", 75);
        this.Users.set(user1.id, user1);
        this.Users.set(user2.id, user2);
        this.Users.set(user3.id, user3);

        //initialize mock game data
        const game1 = new Game(1, 1, "user1", 1, "Morning Basketball", "Let's play some basketball!", 10, 2, GameStatus.Active, new Date(), new Date(), false, SkillLevel.Intermediate, GenderPreference.NoPreference, 5, AccessType.Public, new Date(), new Date());
        const game2 = new Game(2, 2, "user2", 2, "Evening Soccer", "Join us for a soccer match!", 22, 4, GameStatus.Active, new Date(), new Date(), false, SkillLevel.Beginner, GenderPreference.Coed, 10, AccessType.Private, new Date(), new Date());
        const game3 = new Game(3, 3, "user3", 3, "Weekend Football", "Looking for players for football this weekend!", 12, 6, GameStatus.Coordination, new Date(), new Date(), false, SkillLevel.Advanced, GenderPreference.AllMale, 3, AccessType.Public, new Date(), new Date());
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const game4 = new Game(4, 1, "user2", 2, "Afternoon Basketball", "Basketball in the afternoon!", 10, 2, GameStatus.Active, tomorrow, tomorrow, false, SkillLevel.Intermediate, GenderPreference.NoPreference, 5, AccessType.Public, new Date(), new Date());
        const game5 = new Game(5, 2, "user1", 2, "Morning Soccer", "Soccer in the morning!", 22, 4, GameStatus.Active, tomorrow, tomorrow, false, SkillLevel.Beginner, GenderPreference.Coed, 10, AccessType.Public, new Date(), new Date());
        const game6 = new Game(6, 3, "user3", 1, "Weekend Football", "Football this weekend!", 12, 6, GameStatus.Coordination, tomorrow, tomorrow, false, SkillLevel.Advanced, GenderPreference.AllMale, 3, AccessType.Public, new Date(), new Date());
        const game7 = new Game(7, 3, "user3", 1, "Weekend Football", "Football this weekend!", 12, 6, GameStatus.Active, tomorrow, tomorrow, false, SkillLevel.Advanced, GenderPreference.AllMale, 3, AccessType.Private, new Date(), new Date());
        this.Games.set(game1.id, game1);
        this.Games.set(game2.id, game2);
        this.Games.set(game3.id, game3);
        this.Games.set(game4.id, game4);
        this.Games.set(game5.id, game5);
        this.Games.set(game6.id, game6);
        this.Games.set(game7.id, game7);

        this.userGames.set("user1", [1, 3]);
        this.userGames.set("user2", [2, 4]);
        this.userGames.set("user3", [3, 6, 7]);

        // Initialize mock location data
        const location1 = new Location(1, "testGoogle", "Mission Playground Basketball Court", "2450 Harrison St", "San Francisco", "California", "94110", "USA", 37.758900, -122.412200);
        const location2 = new Location(2, "testGoogle", "Kezar Stadium Soccer Field", "755 Stanyan St", "San Francisco", "California", "94117", "USA", 37.767600, -122.454100);
        const location3 = new Location(3, "testGoogle", "Downtown Football Stadium", "789 Pine Rd", "New York", "New York", "90873", "USA", 40.750000, -73.990000);
        this.Locations.set(location1.id, location1);
        this.Locations.set(location2.id, location2);
        this.Locations.set(location3.id, location3);

        // Initialize mock sport data
        const sport1 = new Sport(1, "Basketball", SportCategory.Indoor, "basketball", "https://example.com/sport1.jpg", SportStatus.Active);
        const sport2 = new Sport(2, "Soccer", SportCategory.Outdoor, "soccer", "https://example.com/sport2.jpg", SportStatus.Active);
        const sport3 = new Sport(3, "American Football", SportCategory.Indoor, "american-football", "https://example.com/sport3.jpg", SportStatus.Active);
        this.Sports.set(sport1.id, sport1);
        this.Sports.set(sport2.id, sport2);
        this.Sports.set(sport3.id, sport3);

        this.userSports.set("user1", [1, 2]);
        this.userSports.set("user2", [2, 3]);
        this.userSports.set("user3", [1, 3]);
    }
}

export default new MockDataStore();