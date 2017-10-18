defmodule PlanIt.Trip do
  use Ecto.Schema



  schema "trip" do
    belongs_to :day, PlanIt.Day

    field :name, :string
    field :intensity, :integer
    field :visibility, :boolean
    field :upvotes, :integer
    field :user_id, has_many(:user, PlanIt.User)
    field :first_card_id, has_many(:card, PlanIt.Card)
    field :last_card_id, has_many(:card, PlanIt.Card)

    timestamps()
  end
end



