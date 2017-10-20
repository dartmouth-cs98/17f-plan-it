defmodule PlanIt.Trip do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "trip" do
    belongs_to :user, PlanIt.User
    belongs_to :card, PlanIt.Card
    has_many :day, PlanIt.Day
    

    field :name, :string
    field :intensity, :integer
    field :visibility, :boolean
    field :upvotes, :integer

    timestamps()
  end
end
