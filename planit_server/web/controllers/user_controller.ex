defmodule PlanIt.UserController do
  alias PlanIt.Repo
  alias PlanIt.User
  alias PlanIt.Card
  alias PlanIt.Trip
  alias PlanIt.Travel

  use PlanIt.Web, :controller

  def index(conn, _params) do
    #query = from u in PlanIt.User,
    # preload: [{:trip, [{:card, :card_travel}, :day]}]
    #users = Repo.all(query)

    #users = PlanIt.User |> Repo.all |> Repo.preload(trip: :card) |> Repo.preload(trip: :day) |> Repo.preload(:trip [card: :card_travel])
    users = PlanIt.User
            |> Repo.all

    json conn, users
  end

  def create_sample(conn, _params) do

    Repo.insert!(%User{fname: "Sam", lname: "Lee", email: "samlee@example.com", username: "slee", birthday: ~D[1996-12-31]})

    Repo.insert!(%Travel{type: "walking", duration: ~T[10:10:00]})

    Repo.insert!(%Card{type: "restaurant", name: "Pine", city: "Hanover", country: "USA", address: "Corner of the Green", start_time: DateTime.from_naive!(~N[2016-05-24 13:26:08.003], "Etc/UTC"), end_time: DateTime.from_naive!(~N[2016-05-24 13:26:08.003], "Etc/UTC"), day_number: 1, travel_id: 1})

    Repo.insert!(%Card{type: "exercise", name: "Alumni Gym", city: "Hanover", country: "USA", address: "In front of East Wheelock", start_time: DateTime.from_naive!(~N[2016-05-24 13:26:08.003], "Etc/UTC"), end_time: DateTime.from_naive!(~N[2016-05-24 13:26:08.003], "Etc/UTC"), day_number: 1, travel_id: 1})


    Repo.insert!(%Trip{name: "test trip", user_id: 1})

    json conn, []
  end
end
