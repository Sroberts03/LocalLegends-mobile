import { LoginFormData, SignUpFormData } from "../Auth.types";
import { supabase } from "@/src/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";

export const AuthApi = {
    async login(formData: LoginFormData): Promise<{
        user: User;
        session: Session;
    }> {
        const { data, error } = await supabase.auth.signInWithPassword(formData);

        if (error) {
            console.log(error);
            throw new Error("Login failed: Invalid email or password.");
        }

        if (!data.user || !data.session) {
            throw new Error("Login failed: Invalid email or password");
        }

        return {
            user: data.user,
            session: data.session
        };
    },

    async uploadProfilePhoto(uri: string, userId: string): Promise<string> {
        try {
            const fileName = `${userId}/profile.jpg`;
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: "base64",
            });

            const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");

            const { data, error } = await supabase.storage
                .from("ProfilePhotos")
                .upload(fileName, decode(base64Data), {
                    contentType: "image/jpeg",
                    upsert: true,
                });

            if (error) {
                console.error("Supabase Storage Error Details:", error);
                throw new Error("Failed to upload profile photo.");
            }

            const { data: { publicUrl } } = supabase.storage
                .from("ProfilePhotos")
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (err) {
            console.error("Error uploading photo:", err);
            throw new Error("Failed to upload profile photo.");
        }
    },

    async signUp(formData: SignUpFormData) : Promise<{
        user: User;
        session: Session;   
    }> {
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    display_name: formData.displayName,
                }
            }
        });

        if (error) {
            console.log(error);
            throw new Error("Sign up failed: please try again.");
        }

        if (!data.user || !data.session) {
            throw new Error("Sign up failed: please try again.");
        }

        return {
            user: data.user,
            session: data.session
        };
    },

    async finishSignUp(imageUrl: string, displayName: string, userId: string) : Promise<void> {
        const { data, error } = await supabase
        .from("profiles")
        .update({
            display_name: displayName,
            profile_url: imageUrl,
        })
        .eq("id", userId);

        if (error) {
            console.log(error);
            throw new Error(error.message || "Sign up failed: please try again.");
        }

        return;
    },

    async logout() : Promise<void> {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log(error);
            throw new Error("Logout failed: please try again.");
        }

        return;
    }
}
