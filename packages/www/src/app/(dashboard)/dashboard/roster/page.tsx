"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

const ARTISTS = gql`
  query Artists {
    artists {
      id
      name
      aliases
      genres
    }
  }
`;

const CREATE_ARTIST = gql`
  mutation CreateArtist($name: String!) {
    createArtist(name: $name) {
      id
      name
    }
  }
`;

export default function RosterPage() {
  const { data, loading } = useQuery(ARTISTS);
  const [createArtist] = useMutation(CREATE_ARTIST, {
    refetchQueries: [{ query: ARTISTS }],
  });
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) return;
    await createArtist({ variables: { name: name.trim() } });
    setName("");
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-zinc-900">Roster</h1>
      </div>

      <div className="mt-6 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Artist name"
          className="rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Add Artist
        </button>
      </div>

      {loading && !data && (
        <div className="mt-8 text-sm text-zinc-400">Loading...</div>
      )}

      {data?.artists?.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 py-16">
          <p className="text-sm text-zinc-500">No artists on roster yet</p>
          <p className="mt-1 text-xs text-zinc-400">
            Add artists to manage their bookings
          </p>
        </div>
      )}

      {data?.artists?.length > 0 && (
        <div className="mt-6 divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-white">
          {data.artists.map((artist: { id: string; name: string; genres: string[] }) => (
            <div key={artist.id} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium text-zinc-900">{artist.name}</span>
              {artist.genres.length > 0 && (
                <span className="text-xs text-zinc-500">{artist.genres.join(", ")}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
